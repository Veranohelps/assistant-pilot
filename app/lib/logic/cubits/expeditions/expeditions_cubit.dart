import 'package:app/logic/api_maps/dashboard.dart';
import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/forms/create_expedition/dto/create_expedition.dart';
import 'package:app/logic/models/expedition.dart';

part 'expeditions_state.dart';

class ExpeditionsCubit extends AuthenticationDependendCubit<ExpeditionsState> {
  ExpeditionsCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, ExpeditionsInitial());

  var dashboardApi = DashboardApi();
  final expeditionsApi = ExpeditionsApi();

  Future<void> fetch() async {
    emit(ExpeditionsLoading());
    var res = await dashboardApi.fetch();

    emit(DashboardLoaded(
      upcomingExpeditions: res.upcomingExpeditions,
      pendingExpeditionInvite: res.pendingExpeditionInvite,
    ));
  }

  @override
  void clear() {
    emit(ExpeditionsInitial());
  }

  @override
  Future<void> load(token) async {
    await fetch();
  }

  Future<void> create(ExpeditionDto expeditionData) async {
    await expeditionsApi.create(expeditionData);
    await fetch();
  }

  Future<void> update(String id, ExpeditionDto expeditionData) async {
    await expeditionsApi.update(id, expeditionData);
    await fetch();
  }

  Future<void> reject(String id) async {
    await expeditionsApi.reject(id);
    await fetch();
  }

  Future<void> accept(String id) async {
    await expeditionsApi.accept(id);
    await fetch();
  }

  Future<void> leave(String id) async {
    await expeditionsApi.leave(id);
    await fetch();
  }
}
