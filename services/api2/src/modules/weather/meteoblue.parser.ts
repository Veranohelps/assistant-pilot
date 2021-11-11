import {
  IForecastHourly,
  IMeteograms,
  IRangeHourly,
  ISunCalendar,
} from './types/wheather-prediction.type';

export function parseResponse(
  ranges: string[],
  meteogramUrl: string,
  resTrendPro: string[],
  resSunMoon: string,
  dailyMode: boolean,
) {
  const meteoblueResponseTrendPro: any[] = [];
  const meteograms: IMeteograms[] = [];
  ranges.forEach((v: string, i: number) => {
    meteoblueResponseTrendPro.push(JSON.parse(resTrendPro[i]));
    meteograms.push({
      range: v,
      meteogram: meteogramUrl, //Check this, we need an array of meteogramsUrls!!!
    });
  });
  const forecastHourly = parseResponseTrendPro(ranges, meteoblueResponseTrendPro, dailyMode);
  const meteoblueResponseSunMoon = JSON.parse(resSunMoon);
  const sunCalendar = parseResponseSunMoon(meteoblueResponseSunMoon, dailyMode);

  return {
    metadata: {
      provider: 'Meteoblue',
      timezone: meteoblueResponseSunMoon.metadata.timezone_abbrevation,
      timezoneUTCOffsetInMinutes: meteoblueResponseSunMoon.metadata.utc_timeoffset * 60,
      dailyMode: dailyMode,
    },
    meteograms: meteograms,
    sunCalendar: sunCalendar,
    forecastHourly: forecastHourly,
  };
}
function parseResponseTrendPro(
  ranges: string[],
  meteoblueResponseTrendPro: any,
  dailyMode: boolean,
): IForecastHourly[] {
  const time = meteoblueResponseTrendPro[0].trend_1h.time; //one point is guarantee
  const forecastHourly: IForecastHourly[] = [];
  time.forEach((_v: string, k: number) => {
    const hourlyRanges: IRangeHourly[] = [];
    ranges.forEach((v: string, i: number) => {
      const time = meteoblueResponseTrendPro[i].trend_1h.time;
      const temperature = meteoblueResponseTrendPro[i].trend_1h.temperature;
      const feltTemperature = meteoblueResponseTrendPro[i].data_1h.felttemperature; //feltTemperature in basic-1h api package!!!!
      const precipitation = meteoblueResponseTrendPro[i].trend_1h.precipitation;
      const precipitationProbability =
        meteoblueResponseTrendPro[i].trend_1h.precipitation_probability;
      const visibility = meteoblueResponseTrendPro[i].trend_1h.visibility;
      const lowClouds = meteoblueResponseTrendPro[i].trend_1h.lowclouds;
      const midClouds = meteoblueResponseTrendPro[i].trend_1h.midclouds;
      const hiClouds = meteoblueResponseTrendPro[i].trend_1h.hiclouds;
      const totalCloudCover = meteoblueResponseTrendPro[i].trend_1h.totalcloudcover;
      const sunshineTime = meteoblueResponseTrendPro[i].trend_1h.sunshinetime;
      const windSpeed = meteoblueResponseTrendPro[i].trend_1h.windspeed;
      const windGust = meteoblueResponseTrendPro[i].trend_1h.gust;
      const isDay = meteoblueResponseTrendPro[i].data_1h.isdaylight; //isdaylighit in basic-1h api package!!!!
      const pictoCode = meteoblueResponseTrendPro[i].trend_1h.pictocode;
      const range = {
        range: v,
        temperature: temperature[k],
        feltTemperature: feltTemperature[k],
        precipitation: precipitation[k],
        precipitationProbability: precipitationProbability[k],
        visibility: visibility[k],
        lowClouds: lowClouds[k],
        midClouds: midClouds[k],
        hiClouds: hiClouds[k],
        totalCloudCover: totalCloudCover[k],
        sunshineTime: sunshineTime[k],
        windSpeed: windSpeed[k],
        windGust: windGust[k],
        isDay: isDay[k] == 1,
        pictoCode: pictoCode[k],
      };
      hourlyRanges.push(range);
      forecastHourly.push({
        dateTime: time[k],
        ranges: hourlyRanges,
      });
    });
  });
  const limSup = dailyMode ? forecastHourly.length : 2 * 24;
  return forecastHourly.slice(0, limSup);
}
function parseResponseSunMoon(meteoblueResponseSunMoon: any, dailyMode: boolean): ISunCalendar[] {
  const timeSunMoon = meteoblueResponseSunMoon.data_day.time;
  const sunriseTime = meteoblueResponseSunMoon.data_day.sunrise;
  const sunsetTime = meteoblueResponseSunMoon.data_day.sunset;
  const moonriseTime = meteoblueResponseSunMoon.data_day.moonrise;
  const moonsetTime = meteoblueResponseSunMoon.data_day.moonset;
  const moonPhase = meteoblueResponseSunMoon.data_day.moonphasename;
  const sunCalendar: ISunCalendar[] = [];
  const utcTimeOffset = formatTimeUTCOffset(meteoblueResponseSunMoon.metadata.utc_timeoffset);

  timeSunMoon.forEach((v: string, k: number) => {
    const dayString = `${v}T00:00${utcTimeOffset}`;
    const sunriseString = `${v}T${sunriseTime[k]}${utcTimeOffset}`;
    const sunsetString = `${v}T${sunsetTime[k]}${utcTimeOffset}`;
    const moonriseString = `${v}T${moonriseTime[k]}${utcTimeOffset}`;
    const moonsetString = `${v}T${moonsetTime[k]}${utcTimeOffset}`;
    const moonPhaseName = moonPhase[k];

    sunCalendar.push({
      dateTime: dayString,
      sunriseDateTime: sunriseString,
      sunsetDateTime: sunsetString,
      moonriseDateTime: moonriseString,
      moonsetDatetime: moonsetString,
      moonPhaseName: moonPhaseName,
    });
  });
  const firstDayOfPrediction = new Date(meteoblueResponseSunMoon.data_day.time[0]).getDate();
  const today = new Date().getDate();
  const limInf = today - firstDayOfPrediction;
  const limSup = dailyMode ? sunCalendar.length : limInf + 2;
  return sunCalendar.slice(limInf, limSup);
}

function formatTimeUTCOffset(offset: number) {
  const totalMinutes = offset * 60;
  const hours = `${Math.abs(Math.floor(totalMinutes / 60))}`.padStart(2, '0');
  const minutes = `${totalMinutes % 60}`.padStart(2, '0');
  const sign = offset >= 0 ? '+' : '-';
  return `${sign}${hours}:${minutes}`;
}

export function getAltitude(resTrendPro: string): number {
  return JSON.parse(resTrendPro).metadata.height;
}
