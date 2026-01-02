<?php

namespace Modules\Admob\Http\Services;

use Carbon\Carbon;
use DateTime;
use Google_Client;
use Google\Service\AdMob;
use Modules\Admob\Entities\Admob as EntitiesAdmob;
use Modules\Base\Http\Traits\HasResponseTrait;

class AdmobNetworkReportService
{
    use HasResponseTrait;

    public function getReport($client, $params)
    {
        $networkReportResponse = $this->getNetworkReport($client, $params);

        // Convert mediation report response to a simple object.
        $networkReportResponse  = get_object_vars($networkReportResponse->tosimpleObject());

        // Print each record in the report.
        if (is_array($networkReportResponse) && !empty($networkReportResponse)) {
            if (count($networkReportResponse) > 2) {
                return $this->modifyReportFormat($networkReportResponse);
            } else {
                return $networkReportResponse;
            }
        }

        return abort('No report found.', 400);
    }

    public function modifyReportFormat(array $report)
    {
        foreach ($report as $key => $items) {
            if (array_key_exists('row', $items)) {
                if (array_key_exists('metricValues', $items['row'])) {
                    if (array_key_exists('ESTIMATED_EARNINGS', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['ESTIMATED_EARNINGS']['value'] = number_format(($items['row']['metricValues']['ESTIMATED_EARNINGS']['microsValue'] / 1000000) * $this->usdToOmr(), 2);
                        $report[$key]['row']['metricValues']['ESTIMATED_EARNINGS']['report'] = round(($items['row']['metricValues']['ESTIMATED_EARNINGS']['microsValue'] / 1000000) * $this->usdToOmr(), 2);
                    }
                    if (array_key_exists('CLICKS', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['CLICKS']['value'] = number_format($items['row']['metricValues']['CLICKS']['integerValue']);
                        $report[$key]['row']['metricValues']['CLICKS']['report'] = $items['row']['metricValues']['CLICKS']['integerValue'];
                    }
                    if (array_key_exists('IMPRESSIONS', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['IMPRESSIONS']['value'] = number_format($items['row']['metricValues']['IMPRESSIONS']['integerValue']);
                        $report[$key]['row']['metricValues']['IMPRESSIONS']['report'] = $items['row']['metricValues']['IMPRESSIONS']['integerValue'];
                    }
                    if (array_key_exists('AD_REQUESTS', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['AD_REQUESTS']['value'] = number_format($items['row']['metricValues']['AD_REQUESTS']['integerValue']);
                        $report[$key]['row']['metricValues']['AD_REQUESTS']['report'] = $items['row']['metricValues']['AD_REQUESTS']['integerValue'];
                    }
                    if (array_key_exists('MATCHED_REQUESTS', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['MATCHED_REQUESTS']['value'] = number_format($items['row']['metricValues']['MATCHED_REQUESTS']['integerValue']);
                        $report[$key]['row']['metricValues']['MATCHED_REQUESTS']['report'] = $items['row']['metricValues']['MATCHED_REQUESTS']['integerValue'];
                    }
                    if (array_key_exists('IMPRESSION_RPM', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['IMPRESSION_RPM']['value'] = number_format($items['row']['metricValues']['IMPRESSION_RPM']['doubleValue'] * $this->usdToOmr(), 2, '.', ',');
                        $report[$key]['row']['metricValues']['IMPRESSION_RPM']['report'] = round($items['row']['metricValues']['IMPRESSION_RPM']['doubleValue'] * $this->usdToOmr(), 2);
                    }
                    if (array_key_exists('MATCH_RATE', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['MATCH_RATE']['value'] = number_format($items['row']['metricValues']['MATCH_RATE']['doubleValue'] * 100, 2, '.', ',');
                        $report[$key]['row']['metricValues']['MATCH_RATE']['report'] = round($items['row']['metricValues']['MATCH_RATE']['doubleValue'] * 100, 2);
                    }
                    if (array_key_exists('SHOW_RATE', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['SHOW_RATE']['value'] = number_format($items['row']['metricValues']['SHOW_RATE']['doubleValue'] * 100, 2, '.', ',');
                        $report[$key]['row']['metricValues']['SHOW_RATE']['report'] = round($items['row']['metricValues']['SHOW_RATE']['doubleValue'] * 100, 2);
                    }
                    if (array_key_exists('IMPRESSION_CTR', $items['row']['metricValues'])) {
                        $report[$key]['row']['metricValues']['IMPRESSION_CTR']['value'] = number_format($items['row']['metricValues']['IMPRESSION_CTR']['doubleValue'] * 100, 2, '.', ',');
                        $report[$key]['row']['metricValues']['IMPRESSION_CTR']['report'] = round($items['row']['metricValues']['IMPRESSION_CTR']['doubleValue'] * 100, 2);
                    }

                    $report['0']['header']['localizationSettings']['currencyCode'] = $this->usdToOmr() != 1 ? 'OMR' : $report['0']['header']['localizationSettings']['currencyCode'];
                }
                if (array_key_exists('dimensionValues', $items['row'])) {
                    if (array_key_exists('DATE', $items['row']['dimensionValues'])) {
                        $date = new DateTime($items['row']['dimensionValues']['DATE']['value']);
                        $report[$key]['row']['dimensionValues']['DATE']['value'] = $date->format('Y-m-d');
                    }
                }
            }
        }

        return $report;
    }

    public function getNetworkReport(Google_Client $client, array $params)
    {
        $admob = EntitiesAdmob::first();
        if (!$admob || is_null($admob->name)) {
            return $this->handleError('Can not get adunits.', ['error' => 'Bad request'], 400);
        }
        $accountName = $admob->name;
        $service = new AdMob($client);

        $networkReportRequest = self::createNetworkReportRequest($params);

        return $service->accounts_networkReport->generate(
            $accountName,
            $networkReportRequest
        );
    }

    public static function createNetworkReportRequest(array $params)
    {
        /*
         * AdMob API only supports the account default timezone and
         * "America/Los_Angeles", see
         * https://developers.google.com/admob/api/v1/reference/rest/v1/accounts.mediationReport/generate
         * for more information.
         */
        if (array_key_exists('start_date', $params)) {
            $startDate = DateUtilsService::getDate($params['start_date']);
            $endDate = DateUtilsService::getDate($params['end_date']);
        } else {
            $startDate = DateUtilsService::oneWeekBeforeToday();
            $endDate = DateUtilsService::today();
        }

        // Specify date range.
        $dateRange = new \Google_Service_AdMob_DateRange();
        $dateRange->setStartDate($startDate);
        $dateRange->setEndDate($endDate);


        if (array_key_exists('apps', $params) && !empty($params['apps'])) {
            $dimensionFilterMatches = new \Google_Service_AdMob_NetworkReportSpecDimensionFilter();
            $apps = new \Google_Service_AdMob_StringList();
            $apps->setValues($params['apps']);
            $dimensionFilterMatches->setDimension('APP');
            $dimensionFilterMatches->setMatchesAny($apps);
        }

        // should be deleted just send params even user has sent request

        // if (!$admin && (array_key_exists('apps', $params) || empty($params['apps']))) {
        //     $dimensionFilterMatches = new \Google_Service_AdMob_NetworkReportSpecDimensionFilter();
        //     $apps = new \Google_Service_AdMob_StringList();
        //     $apps->setValues(auth()->user()->apps->where('panel_id', $panel->id)->pluck('app_id')->toArray());
        //     $dimensionFilterMatches->setDimension('APP');
        //     $dimensionFilterMatches->setMatchesAny($apps);
        // }

        // Create network report specification.
        $reportSpec = new \Google_Service_AdMob_NetworkReportSpec();
        $reportSpec->setMetrics($params['metrics']);
        $reportSpec->setDimensions($params['dimensions']);
        $reportSpec->setDateRange($dateRange);

        if (array_key_exists('apps', $params) && !empty($params['apps'])) {
            $reportSpec->setDimensionFilters($dimensionFilterMatches);
        }

        // Create network report request.
        $networkReportRequest = new \Google_Service_AdMob_GenerateNetworkReportRequest();
        $networkReportRequest->setReportSpec($reportSpec);

        return $networkReportRequest;
    }

    public function getHeaderData(Google_Client $client, array $apps = [])
    {
        // yesterday and today
        $start_date = Carbon::yesterday()->format('Uv');
        $end_date = Carbon::now()->format('Uv');

        $dimensions = ['DATE'];
        $metrics = ['ESTIMATED_EARNINGS'];
        $params = $this->prepareParams($dimensions, $metrics, $start_date, $end_date, $apps);

        $networkReport = $this->getReport($client, $params);
        $header['currencyCode'] = $networkReport['0']['header']['localizationSettings']['currencyCode'];
        if (count($networkReport) > 3) {
            $header['yesterday'] = $networkReport['1']['row'];
            $header['today_so_far'] = $networkReport['2']['row'];
        } elseif (
            count($networkReport) > 2
        ) {
            $header['today_so_far'] = $networkReport['1']['row'];
            $header['yesterday'] = 0;
        } else {
            $header['yesterday'] = 0;
            $header['today_so_far'] = 0;
        }

        // Last month
        $start_date = new Carbon('first day of last month');
        $start_date = $start_date->format('Uv');
        $end_date = new Carbon('last day of last month');
        $end_date = $end_date->format('Uv');

        $dimensions = [];
        $metrics = ['ESTIMATED_EARNINGS'];
        $params = $this->prepareParams($dimensions, $metrics, $start_date, $end_date, $apps);
        $lastMonth = $this->getReport($client, $params);
        if (count($lastMonth) > 2) {
            $header['last_month'] = $lastMonth['1']['row'];
        } else {
            $header['last_month'] = 0;
        }

        // This Month so far
        $start_date = Carbon::now()->firstOfMonth()->format('Uv');
        $end_date = Carbon::now()->format('Uv');
        $dimensions = [];
        $metrics = ['ESTIMATED_EARNINGS'];
        $params = $this->prepareParams($dimensions, $metrics, $start_date, $end_date, $apps);
        $thisMonth = $this->getReport($client, $params);

        if (count($thisMonth) > 2) {
            $header['this_month_so_far'] = $thisMonth['1']['row'];
        } else {
            $header['this_month_so_far'] = 0;
        }

        return $header;
    }

    public function prepareParams(array $dimensions, array  $metrics, string $start_date, string $end_date, array $apps = []): array
    {
        return array_merge(
            ['dimensions' => $dimensions],
            ['metrics' => $metrics],
            ['start_date' => $start_date],
            ['end_date' => $end_date],
            ['apps' => $apps]
        );
    }


    public function getDataDispute($result1, $result2, $metrics)
    {
        if (count($result2) > 2) {
            $arrayValue1 = $result1['1']['row']['metricValues'];
            $arrayValue2 = $result2['1']['row']['metricValues'];

            foreach ($arrayValue1 as $key => $value1) {
                $earning1 =  array_values($value1)[0];
                $earning2 = array_values($arrayValue2[$key])[0];

                $difference = $earning1 - $earning2;
                $percentage = $difference / abs($earning2)  * 100;
                $data[$key]['value'] = $key == 'ESTIMATED_EARNINGS' ? number_format($earning1 / 1000000, 2) : number_format($earning1, 2, '.', ',');
                $data[$key]['percentage'] = number_format($percentage, 2, '.', ',');
                $data[$key]['difference'] = $key == 'ESTIMATED_EARNINGS' ? number_format($difference / 1000000, 2) : number_format($difference, 2, '.', ',');
            }
        } elseif (count($result1) > 2) {
            $arrayValue1 = $result1['1']['row']['metricValues'];
            foreach ($arrayValue1 as $key => $value1) {
                $earning1 =  array_values($value1)[0];
                $data[$key]['value'] = $key == 'ESTIMATED_EARNINGS' ? number_format($earning1 / 1000000, 2) : number_format($earning1, 2, '.', ',');
                $data[$key]['percentage'] = 100;
                $data[$key]['difference'] = $key == 'ESTIMATED_EARNINGS' ? number_format($earning1 / 1000000, 2) : number_format($earning1, 2, '.', ',');
            }
        } else {
            foreach ($metrics as $metric) {
                $data[$metric]['value'] = 0;
                $data[$metric]['percentage'] = 0;
                $data[$metric]['difference'] = 0;
            }
        }

        return $data;
    }

    public function usdToOmr()
    {
        return in_array(config('app.url'), config('base.omr_panel')) ? config('base.omr_to_usd_exchange_rate') : 1;
    }
}
