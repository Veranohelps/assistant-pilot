import 'dart:io';

import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/profile.dart';
import 'package:dio/dio.dart';
import 'package:either_option/either_option.dart';
import 'package:http_parser/http_parser.dart';

const mockKey = 'UserMockKey';

const profileUrl = '/user/profile';
const updateProfileUrl = '/user/edit-profile';
const deleteProfileUrl = '/user/delete-account';

const finishRegistrationUrl = '/user/complete-registration';
const assessmentSubmitUrl = '/assessment/submit';

const deleteAvatarUrl = '/user/delete-avatar';
const updateAvatarUrl = '/user/update-avatar';

const searchUrl = '/user/search';

const uploadGpxUrl = '/route/create';

class UserApi extends PrivateDersuApi {
  Future<Profile> fetch() async {
    var client = await getClient();
    var res = await client.get(profileUrl);
    client.close();
    var json = res.data['data']['profile']['user'];
    return Profile.fromJson(json);
  }

  Future<FilledProfile> signUp(
      {required String firstName,
      required String lastName,
      required bool isSubscribedToNewsletter,
      required bool hasReadPrivacyPolicy,
      required bool hasAcceptedTermsAndConditions}) async {
    var client = await getClient();
    await client.patch(finishRegistrationUrl, data: {
      'firstName': firstName,
      'lastName': lastName,
      'isSubscribedToNewsletter': isSubscribedToNewsletter,
      'hasReadPrivacyPolicy': hasReadPrivacyPolicy,
      'hasAcceptedTermsAndConditions': hasAcceptedTermsAndConditions
    });
    client.close();

    return await fetch() as FilledProfile;
  }

  Future<List<User>> search({required String searchString}) async {
    var client = await getClient();
    var res =
        await client.get(searchUrl, queryParameters: {'name': searchString});
    client.close();

    return (res.data['data']['users'] as List)
        .map<User>((json) => User.fromJson(json))
        .toList();
  }

  Future<FilledProfile> setNewLevels({required List<String> levels}) async {
    var client = await getClient();

    await client.post(assessmentSubmitUrl, data: {"levels": levels});
    client.close();

    return await fetch() as FilledProfile;
  }

  Future<void> deleteAvatar() async {
    var client = await getClient();

    await client.delete(deleteAvatarUrl);
    client.close();
  }

  Future<String> updateAvatar(File file) async {
    String fileName = file.path.split('/').last;
    var fileExt = fileName.split('.').last;
    var formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        file.path,
        filename: fileName,
        contentType: MediaType("image", fileExt),
      ),
    });
    var client = await getClient();

    var res = await client.patch(updateAvatarUrl, data: formData);
    client.close();

    return res.data['data']['user']['avatar'];
  }

  Future<void> updateProfile(String firstName, String lastName) async {
    var client = await getClient();

    await client.patch(updateProfileUrl, data: {
      'firstName': firstName,
      'lastName': lastName,
    });

    client.close();
  }

  Future<void> deleteProfile(String text) async {
    var client = await getClient();

    text.isEmpty
        ? await client.delete(deleteProfileUrl)
        : await client.delete(deleteProfileUrl, data: {'text': text});

    client.close();
  }

  Future<Either<HttpException, void>> uploadGpxFile(String gpxFilePath) async {
    var formData = FormData.fromMap({
      'gpx': await MultipartFile.fromFile(
        gpxFilePath,
        filename: gpxFilePath.split("/").last,
        contentType: MediaType("image", "gpx"),
      ),
      'name': gpxFilePath.split("/").last
    });

    var client = await getClient();

    try {
      await client.post(uploadGpxUrl, data: formData);
      return Right(null);
    } on DioError catch (error) {
      return Left(HttpException(error.response?.data['message'] ?? 'error'));
    } finally {
      client.close();
    }
  }
}
