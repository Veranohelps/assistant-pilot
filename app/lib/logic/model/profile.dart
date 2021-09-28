import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/model/serialization.dart';

part 'profile.g.dart';

abstract class Profile extends Equatable {
  const Profile();
  abstract final String id;
  abstract final String auth0Id;
  abstract final String email;
  abstract final bool isRegistrationFinished;
  abstract final DateTime updatedAt;

  factory Profile.fromJson(Map<String, dynamic> json) {
    if (json['isRegistrationFinished']) {
      return FilledProfile.fromJson(json);
    } else {
      return IncompleteProfile.fromJson(json);
    }
  }
}

@JsonSerializable(createToJson: false)
class IncompleteProfile extends Profile {
  const IncompleteProfile({
    required this.id,
    required this.auth0Id,
    required this.email,
    required this.updatedAt,
  });

  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final String id;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final String auth0Id;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final String email;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final DateTime updatedAt;

  factory IncompleteProfile.fromJson(Map<String, dynamic> json) =>
      _$IncompleteProfileFromJson(json);

  @override
  List<Object?> get props => [email];

  @override
  final bool isRegistrationFinished = false;
}

@JsonSerializable()
class FilledProfile extends Profile {
  const FilledProfile({
    required this.firstName,
    required this.lastName,
    required this.avatar,
    required this.isSubscribedToNewsletter,
    required this.id,
    required this.auth0Id,
    required this.email,
    required this.isRegistrationFinished,
    required this.updatedAt,
  });

  final String firstName;
  final String lastName;
  final String avatar;

  final bool isSubscribedToNewsletter;

  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final String id;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final String auth0Id;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final String email;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final bool isRegistrationFinished;
  @JsonKey(toJson: Serialization.readOnly, includeIfNull: true)
  final DateTime updatedAt;

  factory FilledProfile.fromJson(Map<String, dynamic> json) =>
      _$FilledProfileFromJson(json);

  Map<String, dynamic> toJson() => _$FilledProfileToJson(this);

  @override
  List<Object?> get props => [
        firstName,
        lastName,
        isSubscribedToNewsletter,
      ];

  FilledProfile copyWith({
    String? firstName,
    String? lastName,
    bool? isSubscribedToNewsletter,
    String? id,
    String? auth0Id,
    String? email,
    bool? isRegistrationFinished,
    String? avatar,
    DateTime? updatedAt,
  }) {
    return FilledProfile(
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      isSubscribedToNewsletter:
          isSubscribedToNewsletter ?? this.isSubscribedToNewsletter,
      id: id ?? this.id,
      auth0Id: auth0Id ?? this.auth0Id,
      email: email ?? this.email,
      isRegistrationFinished:
          isRegistrationFinished ?? this.isRegistrationFinished,
      avatar: avatar ?? this.avatar,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
