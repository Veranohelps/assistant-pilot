import 'package:bloc/bloc.dart';

class TimeFilterCubit extends Cubit<DateTime?> {
  TimeFilterCubit() : super(null);

  void setNewTime(DateTime newTime) {
    emit(newTime);
  }
}
