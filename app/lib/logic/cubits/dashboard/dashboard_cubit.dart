import 'package:app/logic/api_maps/dashboard.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/models/expedition.dart';

part 'dashboard_state.dart';

class DashboardCubit extends AuthenticationDependendCubit<DashboardState> {
  DashboardCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, DashboardInitial());

  var api = DashboardApi();

  Future<void> fetch() async {
    emit(DashboardLoading());
    var res = await api.fetch();
    var newState = res.fold(
      () => DashboardEmpty(),
      (upcomingExpeditions) =>
          DashboardLoaded(upcomingExpeditions: upcomingExpeditions),
    );

    emit(newState);
  }

  @override
  void clear() {
    emit(DashboardInitial());
  }

  @override
  void load(_) {
    fetch();
  }
}
