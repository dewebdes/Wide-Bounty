<?php

namespace Modules\Admob\Http\Services;

use Carbon\Carbon;
use Modules\Admob\Entities\App;
use Modules\Admob\Entities\Statistic;

class AdmobStatisticService
{
    public function saveStatistic($report)
    {
        foreach ($report as $key => $items) {
            if (array_key_exists('row', $items)) {
                $app_id = $report[$key]['row']['dimensionValues']['APP']['value'];
                $app = App::where('app_id', $app_id)->with('panel')->first();
                $result['app_id'] = $app->id;
                $result['panel_id'] = $app->panel_id;
                $result['user_id'] = $app->user_id;
                $result['marketer_id'] = $app->marketer_id;
                $result['digital_marketing'] = $app->digital_marketing;
                $result['estimated_earnings'] = array_key_exists('ESTIMATED_EARNINGS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['ESTIMATED_EARNINGS']['microsValue'] * $this->usdToOmr($app->panel->url) : null;
                $result['ad_requests'] = array_key_exists('AD_REQUESTS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['AD_REQUESTS']['integerValue'] : null;
                $result['impression_rpm'] = array_key_exists('IMPRESSION_RPM', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSION_RPM']['doubleValue'] * $this->usdToOmr($app->panel->url) : null;
                $result['clicks'] = array_key_exists('CLICKS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['CLICKS']['integerValue'] : null;
                $result['impressions'] = array_key_exists('IMPRESSIONS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSIONS']['integerValue'] : null;
                $result['impression_ctr'] = array_key_exists('IMPRESSION_CTR', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSION_CTR']['doubleValue'] : null;
                $result['matched_requests'] = array_key_exists('MATCHED_REQUESTS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['MATCHED_REQUESTS']['integerValue'] : null;
                $result['show_rate'] = array_key_exists('SHOW_RATE', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['SHOW_RATE']['doubleValue'] : null;
                $result['match_rate'] = array_key_exists('MATCH_RATE', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['MATCH_RATE']['doubleValue'] : null;

                $result['currency'] = $this->usdToOmr($app->panel->url) != 1 ? 'OMR' : $report['0']['header']['localizationSettings']['currencyCode'];


                $sta = Statistic::whereDate('created_at', Carbon::today())->updateOrCreate([
                    'app_id' => $app->id,
                    'panel_id' => $app->panel_id,
                    'created_at' => Carbon::today(),
                    ],
                    $result
                );
            }
        }

        info([
            'saveStatistic' => now()
        ]);
    }

    public function allStatisticData($report, array $excluded_params = [])
    {
        foreach ($report as $key => $items) {
            if (array_key_exists('row', $items)) {
                $date = $items['row']['dimensionValues']['DATE']['value'];
                $app_id = $items['row']['dimensionValues']['APP']['value'];
                $app = App::where('app_id', $app_id)->with('panel')->first();
                $result['app_id'] = $app->id;
                $result['panel_id'] = $app->panel_id;
                $result['user_id'] = $app->user_id;
                $result['marketer_id'] = $app->marketer_id;
                $result['digital_marketing'] = $app->digital_marketing;
                $result['estimated_earnings'] = array_key_exists('ESTIMATED_EARNINGS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['ESTIMATED_EARNINGS']['microsValue'] * $this->usdToOmr($app->panel->url) : null;
                $result['ad_requests'] = array_key_exists('AD_REQUESTS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['AD_REQUESTS']['integerValue'] : null;
                $result['impression_rpm'] = array_key_exists('IMPRESSION_RPM', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSION_RPM']['doubleValue'] * $this->usdToOmr($app->panel->url) : null;
                $result['clicks'] = array_key_exists('CLICKS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['CLICKS']['integerValue'] : null;
                $result['impressions'] = array_key_exists('IMPRESSIONS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSIONS']['integerValue'] : null;
                $result['impression_ctr'] = array_key_exists('IMPRESSION_CTR', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSION_CTR']['doubleValue'] : null;
                $result['matched_requests'] = array_key_exists('MATCHED_REQUESTS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['MATCHED_REQUESTS']['integerValue'] : null;
                $result['show_rate'] = array_key_exists('SHOW_RATE', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['SHOW_RATE']['doubleValue'] : null;
                $result['match_rate'] = array_key_exists('MATCH_RATE', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['MATCH_RATE']['doubleValue'] : null;
                $result['currency'] = $this->usdToOmr($app->panel->url) != 1 ? 'OMR' : $report['0']['header']['localizationSettings']['currencyCode'];

                $excluded = array_fill_keys($excluded_params, null);

                $result = array_diff_key($result, $excluded);

                Statistic::whereDate('created_at', $date)->updateOrCreate([
                    'app_id' => $app->id,
                    'panel_id' => $app->panel_id,
                    'created_at' => $date,
                ], $result);
            }
        }

        info([
            'allStatisticData' => now()
        ]);
    }


    public function updateYesterdayStatistic($report)
    {
        foreach ($report as $key => $items) {
            if (array_key_exists('row', $items)) {
                $app_id = $report[$key]['row']['dimensionValues']['APP']['value'];
                $app = App::where('app_id', $app_id)->with('panel')->first();
                $result['app_id'] = $app->id;
                $result['panel_id'] = $app->panel_id;
                $result['user_id'] = $app->user_id;
                $result['marketer_id'] = $app->marketer_id;
                $result['digital_marketing'] = $app->digital_marketing;
                $result['estimated_earnings'] = array_key_exists('ESTIMATED_EARNINGS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['ESTIMATED_EARNINGS']['microsValue'] * $this->usdToOmr($app->panel->url) : null;
                $result['ad_requests'] = array_key_exists('AD_REQUESTS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['AD_REQUESTS']['integerValue'] : null;
                $result['impression_rpm'] = array_key_exists('IMPRESSION_RPM', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSION_RPM']['doubleValue'] * $this->usdToOmr($app->panel->url) : null;
                $result['clicks'] = array_key_exists('CLICKS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['CLICKS']['integerValue'] : null;
                $result['impressions'] = array_key_exists('IMPRESSIONS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSIONS']['integerValue'] : null;
                $result['impression_ctr'] = array_key_exists('IMPRESSION_CTR', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['IMPRESSION_CTR']['doubleValue'] : null;
                $result['matched_requests'] = array_key_exists('MATCHED_REQUESTS', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['MATCHED_REQUESTS']['integerValue'] : null;
                $result['show_rate'] = array_key_exists('SHOW_RATE', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['SHOW_RATE']['doubleValue'] : null;
                $result['match_rate'] = array_key_exists('MATCH_RATE', $items['row']['metricValues'])
                    ? $items['row']['metricValues']['MATCH_RATE']['doubleValue'] : null;

                $result['currency'] = $this->usdToOmr($app->panel->url) != 1 ? 'OMR' : $report['0']['header']['localizationSettings']['currencyCode'];

                Statistic::whereDate('created_at', Carbon::yesterday())->updateOrCreate([
                    'app_id' => $app->id,
                    'panel_id' => $app->panel_id,
                    'created_at' => Carbon::yesterday(),
                ], $result);
            }
        }
        info([
            'updateYesterdayStatistic' => now()
        ]);
    }

    public function getEstimatedEarning($apps, $start_date, $end_date, $userId)
    {
        return Statistic::whereIn('app_id', $apps)
            ->select([
                'estimated_earnings',
            ])
            ->where('user_id', $userId)
            ->whereDate('created_at', '>=', $start_date)
            ->where('created_at', '<=', $end_date)
            ->get();
    }

    public function getEstimatedEarningForAdmin($apps, $start_date, $end_date)
    {
        return Statistic::whereIn('app_id', $apps)
            ->select([
                'estimated_earnings',
            ])
            ->whereDate('created_at', '>=', $start_date)
            ->where('created_at', '<=', $end_date)
            ->get();
    }

    public function marketerEstimatedEarning($apps, $start_date, $end_date, $userId)
    {
        return Statistic::whereIn('app_id', $apps)
            ->select([
                'estimated_earnings',
            ])
            ->where('marketer_id', $userId)
            ->whereDate('created_at', '>=', $start_date)
            ->where('created_at', '<=', $end_date)
            ->get();
    }

    public function calculateReport($statistic)
    {

        $result['IMPRESSION_RPM'] = $statistic->count() > 1
            ? ($statistic->sum('estimated_earnings') / $statistic->sum('impressions')) / 1000
            : $statistic->sum('impression_rpm');

        $result['ESTIMATED_EARNINGS'] = $statistic->sum('estimated_earnings') / 1000000;

        $result['AD_REQUESTS'] = $statistic->sum('ad_requests');

        // $result['MATCH_RATE'] = $statistic->count() > 1
        //     ? ($statistic->sum('match_rate') / $statistic->count('match_rate')) * 100
        //     : $statistic->sum('match_rate') * 100;

        $result['MATCH_RATE'] = $statistic->count() > 1
        ? ($statistic->sum('matched_requests') / $statistic->sum('ad_requests')) * 100
        : $statistic->sum('match_rate') * 100;

        $result['SHOW_RATE'] = $statistic->count() > 1
        ? ($statistic->sum('impressions') / $statistic->sum('matched_requests')) * 100
            : $statistic->sum('show_rate') * 100;

        $result['IMPRESSIONS'] = $statistic->sum('impressions');

        return $result;
    }


    public function shortNumber($num)
    {
        $units = ['', 'K', 'M', 'B', 'T'];

        for ($i = 0; abs($num) >= 1000; $i++) {
            $num /= 1000;
        }
        return round($num, 2) . $units[$i];
    }

    public function usdToOmr($PanelUrl)
    {
        return in_array($PanelUrl, config('admob.omr_panel')) ? config('admob.omr_to_usd_exchange_rate') : 1;
    }
}
