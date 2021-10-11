import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/profile.dart';

const mockKey = 'UserMockKey';

const profileUrl = '/user/profile';
const editProfileUrl = '/user/complete-registration';
const assessmentSubmitUrl = '/assessment/submit';

class UserApi extends PrivateDersuApi {
  Future<Profile> fetch() async {
    var client = await getClient();
    var res = await client.get(profileUrl);
    client.close();
    var json = res.data['data']['profile']['user'];
    json['currentLevels'] = res.data['data']['profile']['currentLevels'];
    return Profile.fromJson(json);
  }

  Future<FilledProfile> signUp({
    required String firstName,
    required String lastName,
    required bool isSubscribedToNewsletter,
  }) async {
    var client = await getClient();
    await client.patch(editProfileUrl, data: {
      'firstName': firstName,
      'lastName': lastName,
      'isSubscribedToNewsletter': isSubscribedToNewsletter,
    });
    client.close();

    return await fetch() as FilledProfile;
  }

  Future<FilledProfile> setNewLevels({required List<String> levels}) async {
    var client = await getClient();

    await client.post(assessmentSubmitUrl, data: {"levels": levels});
    client.close();

    return await fetch() as FilledProfile;
  }
}
