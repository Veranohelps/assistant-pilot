part of 'expeditions_cubit.dart';

abstract class ExpeditionsState extends AuthenticationDependendState {
  const ExpeditionsState();

  @override
  List<Object> get props => [];
}

class ExpeditionsInitial extends ExpeditionsState {}

class ExpeditionsLoading extends ExpeditionsState {}

class DashboardLoaded extends ExpeditionsState {
  final List<ExpeditionShort> upcomingExpeditions;
  final List<ExpeditionShort> pendingExpeditionInvite;

  const DashboardLoaded({
    required this.upcomingExpeditions,
    required this.pendingExpeditionInvite,
  });

  @override
  List<Object> get props => [...upcomingExpeditions, pendingExpeditionInvite];
}
