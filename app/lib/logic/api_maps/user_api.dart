import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/model/profile.dart';

const mockKey = 'UserMockKey';

const profileUrl = '/user/profile';
const editProfileUrl = '/user/complete-registration';

class UserApi extends PrivateDersuApi {
  Future<Profile> fetch() async {
    var client = await getClient();
    var res = await client.get(profileUrl);
    client.close();
    return Profile.fromJson(res.data['data']['profile']['user']);
  }

  Future<FilledProfile> signUp({
    required String firstName,
    required String lastName,
    required bool isSubscribedToNewsletter,
  }) async {
    var client = await getClient();
    var res = await client.patch(editProfileUrl, data: {
      'firstName': firstName,
      'lastName': lastName,
      'isSubscribedToNewsletter': isSubscribedToNewsletter,
    });
    client.close();
    return FilledProfile.fromJson(
      res.data['data']['user'],
    );
  }
}
