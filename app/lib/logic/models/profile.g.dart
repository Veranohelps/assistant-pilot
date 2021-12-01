// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IncompleteProfile _$IncompleteProfileFromJson(Map<String, dynamic> json) =>
    IncompleteProfile(
      id: json['id'] as String,
      auth0Id: json['auth0Id'] as String,
      email: json['email'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

FilledProfile _$FilledProfileFromJson(Map<String, dynamic> json) =>
    FilledProfile(
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      avatar: json['avatar'] as String?,
      isSubscribedToNewsletter: json['isSubscribedToNewsletter'] as bool,
      id: json['id'] as String,
      auth0Id: json['auth0Id'] as String,
      email: json['email'] as String,
      currentLevels: Map<String, String>.from(json['currentLevels'] as Map),
      isRegistrationFinished: json['isRegistrationFinished'] as bool,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$FilledProfileToJson(FilledProfile instance) =>
    <String, dynamic>{
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'avatar': instance.avatar,
      'currentLevels': instance.currentLevels,
      'isSubscribedToNewsletter': instance.isSubscribedToNewsletter,
      'id': readonly(instance.id),
      'auth0Id': readonly(instance.auth0Id),
      'email': readonly(instance.email),
      'isRegistrationFinished': readonly(instance.isRegistrationFinished),
      'updatedAt': readonly(instance.updatedAt),
    };

User _$UserFromJson(Map<String, dynamic> json) => User(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      avatar: json['avatar'] as String?,
      currentLevels: Map<String, String>.from(json['currentLevels'] as Map),
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'id': instance.id,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'avatar': instance.avatar,
      'currentLevels': instance.currentLevels,
    };

GroupUser _$GroupUserFromJson(Map<String, dynamic> json) => GroupUser(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      avatar: json['avatar'] as String?,
      currentLevels: Map<String, String>.from(json['currentLevels'] as Map),
      isOwner: json['isOwner'] as bool,
      inviteStatus: $enumDecode(_$InviteStatusEnumMap, json['inviteStatus']),
    );

Map<String, dynamic> _$GroupUserToJson(GroupUser instance) => <String, dynamic>{
      'id': instance.id,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'avatar': instance.avatar,
      'currentLevels': instance.currentLevels,
      'isOwner': instance.isOwner,
      'inviteStatus': _$InviteStatusEnumMap[instance.inviteStatus],
    };

const _$InviteStatusEnumMap = {
  InviteStatus.pending: 'PENDING',
  InviteStatus.accepted: 'ACCEPTED',
  InviteStatus.rejected: 'REJECTED',
  InviteStatus.left: 'LEFT',
};
