// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IncompleteProfile _$IncompleteProfileFromJson(Map<String, dynamic> json) {
  return IncompleteProfile(
    id: json['id'] as String,
    auth0Id: json['auth0Id'] as String,
    email: json['email'] as String,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

FilledProfile _$FilledProfileFromJson(Map<String, dynamic> json) {
  return FilledProfile(
    firstName: json['firstName'] as String,
    lastName: json['lastName'] as String,
    avatar: json['avatar'] as String,
    isSubscribedToNewsletter: json['isSubscribedToNewsletter'] as bool,
    id: json['id'] as String,
    auth0Id: json['auth0Id'] as String,
    email: json['email'] as String,
    isRegistrationFinished: json['isRegistrationFinished'] as bool,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

Map<String, dynamic> _$FilledProfileToJson(FilledProfile instance) =>
    <String, dynamic>{
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'avatar': instance.avatar,
      'isSubscribedToNewsletter': instance.isSubscribedToNewsletter,
      'id': readonly(instance.id),
      'auth0Id': readonly(instance.auth0Id),
      'email': readonly(instance.email),
      'isRegistrationFinished': readonly(instance.isRegistrationFinished),
      'updatedAt': readonly(instance.updatedAt),
    };
