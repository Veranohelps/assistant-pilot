part of 'dictionaries_cubit.dart';

abstract class DictionariesState extends AuthenticationDependendState {
  const DictionariesState();

  @override
  List<Object> get props => [];
}

class DictionariesNotLoaded extends DictionariesState {}

class DictionariesLoaded extends DictionariesState {
  final List<Category> categories;

  DictionariesLoaded({
    required this.categories,
  });

  @override
  List<Object> get props => [...categories];
}
