import 'package:app/logic/api_maps/user_api.dart';
import 'package:app/logic/models/profile.dart';
import 'package:bloc/bloc.dart';

part 'user_search_state.dart';

class UserSearchCubit extends Cubit<UserSearchState> {
  UserSearchCubit() : super(UserSearchInitial());

  final api = UserApi();
  void search(String searchString) async {
    if (searchString.length <= 2) {
      emit(UserSearchError());
    } else {
      var res = await api.search(searchString: searchString);
      if (res.isEmpty) {
        emit(UserSearchEmpty());
      } else {
        emit(UserSearchLoaded(users: res));
      }
    }
  }
}
