part of 'dashboard_cubit.dart';

abstract class DashboardState extends AuthenticationDependendState {
  const DashboardState();

  @override
  List<Object> get props => [];
}

class DashboardInitial extends DashboardState {}
class DashboardLoading extends DashboardState {}

class DashboardEmpty extends DashboardState {}

class DashboardLoaded extends DashboardState {
  final List<ExpeditionShort> upcomingExpeditions;

  DashboardLoaded({
    required this.upcomingExpeditions,
  });

  @override
  List<Object> get props => [...upcomingExpeditions];
}
