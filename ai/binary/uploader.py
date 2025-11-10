from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.core.files.images import get_image_dimensions
from django.core.files.uploadedfile import UploadedFile
from .models import ChatMedia
from .utils import generate_thumbnail, store_to_s3

class MediaUploadView(View):
    def post(self, request, *args, **kwargs):
        media_file = request.FILES.get('media')
        csrf_token = request.POST.get('csrfmiddlewaretoken')

        # Validate presence of file
        if not media_file or not getattr(media_file, 'name', None):
            return JsonResponse({
                "success": False,
                "errors": {
                    "form": '{"media": [{"message": "This field is required.", "code": "required"}]}',
                    "media": "invalid_media"
                }
            })

        # Validate binary format (image sniffing)
        try:
            width, height = get_image_dimensions(media_file)
        except Exception:
            return JsonResponse({
                "success": False,
                "errors": {
                    "media": "invalid_format"
                }
            })

        # Store media (e.g., to S3)
        media_url, thumbnail_url = store_to_s3(media_file)

        # Save metadata
        chat_media = ChatMedia.objects.create(
            user=request.user,
            media_type='I',
            media_url=media_url,
            media_thumbnail_url=thumbnail_url
        )

        return JsonResponse({
            "success": True,
            "payload": {
                "media_type": "I",
                "media_thumbnail_url": thumbnail_url,
                "media_url": media_url,
                "media_id": chat_media.id,
                "user_uid": request.user.profile.uid
            }
        })
