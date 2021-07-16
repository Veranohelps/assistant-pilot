import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

export 'package:provider/provider.dart';

part 'expeditions_state.dart';

class ExpeditionsCubit extends Cubit<ExpeditionsState> {
  ExpeditionsCubit() : super(ExpeditionsInitial());

  var api = ExpeditionsApi();

  void load() async {
    var expeditions = await api.fetchExpeditions();
    emit(ExpeditionsLoaded(list: expeditions));
  }
}
