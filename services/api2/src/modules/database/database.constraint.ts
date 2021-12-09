export enum DatabaseConstraints {
  // ROUTE
  ROUTE_PKEY = 'ROUTE_PKEY',
  ROUTE_NAME_UNIQUE = 'ROUTE_NAME_UNIQUE',
  ROUTE_ORIGIN_ID_FKEY = 'ROUTE_ORIGIN_ID_FKEY',
  ROUTE_GLOBAL_ID_UNIQUE = 'ROUTE_GLOBAL_ID_UNIQUE', // deprecated
  ROUTE_USER_ID_FKEY = 'ROUTE_USER_ID_FKEY',

  // WAYPOINT
  WAYPOINT_PKEY = 'WAYPOINT_PKEY',
  WAYPOINT_NAME_UNIQUE = 'WAYPOINT_NAME_UNIQUE',
  WAYPOINT_ORIGIN_ID_FKEY = 'WAYPOINT_ORIGIN_ID_FKEY',
  WAYPOINT_USER_ID_FKEY = 'WAYPOINT_USER_ID_FKEY',
  WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_1 = 'WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_1',
  WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_2 = 'WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_2',

  // EXPEDITION
  EXPEDITION_PKEY = 'EXPEDITION_PKEY',
  EXPEDITION_NAME_UNIQUE = 'EXPEDITION_NAME_UNIQUE', // deprecated
  EXPEDITION_USER_ID_FKEY = 'EXPEDITION_USER_ID_FKEY',

  // EXPEDITION-WAYPOINT
  EXPEDITION_WAYPOINT_PKEY = 'EXPEDITION_WAYPOINT_PKEY',
  EXPEDITION_WAYPOINT_EXPEDITION_ID_FKEY = 'EXPEDITION_WAYPOINT_EXPEDITION_ID_FKEY',
  EXPEDITION_WAYPOINT_WAYPOINT_ID_FKEY = 'EXPEDITION_WAYPOINT_WAYPOINT_ID_FKEY',

  // EXPEDITION-ROUTE
  EXPEDITION_ROUTE_PKEY = 'EXPEDITION_ROUTE_PKEY',
  EXPEDITION_ROUTE_EXPEDITION_ID_FKEY = 'EXPEDITION_ROUTE_EXPEDITION_ID_FKEY',
  EXPEDITION_ROUTE_ROUTE_ID_FKEY = 'EXPEDITION_ROUTE_ROUTE_ID_FKEY',

  // SKILL-CATEGORY
  SKILL_CATEGORY_PKEY = 'SKILL_CATEGORY_PKEY',

  // SKILL
  SKILL_PKEY = 'SKILL_PKEY',
  SKILL_CATEGORY_ID_FKEY = 'SKILL_CATEGORY_ID_FKEY',

  // SKILL-LEVEL
  SKILL_LEVEL_PKEY = 'SKILL_LEVEL_PKEY',
  SKILL_LEVEL_SKILL_ID_FKEY = 'SKILL_LEVEL_SKILL_ID_FKEY',
  SKILL_LEVEL_SKILL_ID_LEVEL_UNIQUE = 'SKILL_LEVEL_SKILL_ID_LEVEL_UNIQUE',

  // USER
  USER_PKEY = 'USER_PKEY',
  USER_EMAIL_UNIQUE = 'USER_EMAIL_UNIQUE',
  USER_AUTH0ID_UNIQUE = 'USER_AUTH0ID_UNIQUE',

  // ASSESSMENT
  ASSESSMENT_PKEY = 'ASSESSMENT_PKEY',
  ASSESSMENT_USER_ID_FKEY = 'ASSESSMENT_USER_ID_FKEY',

  // USER-LEVEL
  USER_LEVEL_PKEY = 'USER_LEVEL_PKEY',
  USER_LEVEL_ASSESSMENT_ID_FKEY = 'USER_LEVEL_ASSESSMENT_ID_FKEY',
  USER_LEVEL_SKILL_ID_FKEY = 'USER_LEVEL_SKILL_ID_FKEY',
  USER_LEVEL_LEVEL_ID_FKEY = 'USER_LEVEL_LEVEL_ID_FKEY',
  USER_LEVEL_USER_ID_FKEY = 'USER_LEVEL_USER_ID_FKEY',
  USER_LEVEL_SKILL_ID_USER_ID_UNIQUE = 'USER_LEVEL_SKILL_ID_USER_ID_UNIQUE',

  // ASSESSMENT-HISTORY
  ASSESSMENT_HISTORY_PKEY = 'ASSESSMENT_HISTORY_PKEY',
  ASSESSMENT_HISTORY_ASSESSMENT_ID_FKEY = 'ASSESSMENT_HISTORY_ASSESSMENT_ID_FKEY',
  ASSESSMENT_HISTORY_SKILL_ID_FKEY = 'ASSESSMENT_HISTORY_SKILL_ID_FKEY',
  ASSESSMENT_HISTORY_LEVEL_ID_FKEY = 'ASSESSMENT_HISTORY_LEVEL_ID_FKEY',
  ASSESSMENT_HISTORY_USER_ID_FKEY = 'ASSESSMENT_HISTORY_USER_ID_FKEY',

  // ROUTE-ORIGIN
  ROUTE_ORIGIN_PKEY = 'ROUTE_ORIGIN_PKEY',

  // WAYPOINT-TYPE
  WAYPOINT_TYPE_PKEY = 'WAYPOINT_TYPE_PKEY',

  // ACTIVITY-TYPE
  ACTIVITY_TYPE_PKEY = 'ACTIVITY_TYPE_PKEY',
  ACTIVITY_TYPE_SKILL_ID_FKEY = 'ACTIVITY_TYPE_SKILL_ID_FKEY',

  // ROUTE-ACTIVITY-TYPE
  ROUTE_ACTIVITY_TYPE_PKEY = 'ROUTE_ACTIVITY_TYPE_PKEY',
  ROUTE_ACTIVITY_TYPE_ACTIVITY_TYPE_ID_FKEY = 'ROUTE_ACTIVITY_TYPE_ACTIVITY_TYPE_ID_FKEY',
  ROUTE_ACTIVITY_TYPE_ROUTE_ID_FKEY = 'ROUTE_ACTIVITY_TYPE_ROUTE_ID_FKEY',

  // EXPEDITION-USER
  EXPEDITION_USER_PKEY = 'EXPEDITION_USER_PKEY',
  EXPEDITION_USER_EXPEDITION_ID_FKEY = 'EXPEDITION_USER_EXPEDITION_ID_FKEY',
  EXPEDITION_USER_USER_ID_FKEY = 'EXPEDITION_USER_USER_ID_FKEY',

  // BPA-ZONE
  BPA_ZONE_PKEY = 'BPA_ZONE_PKEY',
  BPA_ZONE_NAME_UNIQUE = 'BPA_ZONE_NAME_UNIQUE',

  // BPA-PROVIDER
  BPA_PROVIDER_PKEY = 'BPA_PROVIDER_PKEY',
  BPA_PROVIDER_NAME_UNIQUE = 'BPA_PROVIDER_NAME_UNIQUE',

  // BPA-REPORT
  BPA_REPORT_PKEY = 'BPA_REPORT_PKEY',
  BPA_REPORT_PROVIDER_ID_FKEY = 'BPA_REPORT_PROVIDER_ID_FKEY',

  // BPA-ZONE-REPORT
  BPA_ZONE_REPORT_PKEY = 'BPA_ZONE_REPORT_PKEY',
  BPA_ZONE_REPORT_ZONE_ID_FKEY = 'BPA_ZONE_REPORT_ZONE_ID_FKEY',
  BPA_ZONE_REPORT_REPORT_ID_FKEY = 'BPA_ZONE_REPORT_REPORT_ID_FKEY',
}
