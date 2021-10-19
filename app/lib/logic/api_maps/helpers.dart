//temp crutch

Map<String, dynamic> formatRoutesResponse(Map<String, dynamic> route) {
  //backend response is redundant;
  //but we cannot only use only parameters we needed, because we are using toJson method and the proccess won't be clear..

  route['boundaries'] = <String, dynamic>{};
  route['boundaries']['nw'] = route['boundingBox']['coordinates'][0][0];
  route['boundaries']['se'] = route['boundingBox']['coordinates'][0][2];

  route.remove('boundingBox');
  return route;
}
