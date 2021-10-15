import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'expedition_state.dart';

class ExpeditionCubit extends Cubit<ExpeditionFull?> {
  ExpeditionCubit() : super(null);

  final api = ExpeditionsApi();

  void getExpedition(String url) async {
    var expedition = await api.loadExpedion(url);
    emit(expedition);
  }
}
