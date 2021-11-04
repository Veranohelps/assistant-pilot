part of '../profile.dart';

class _EditProfile extends StatelessWidget {
  const _EditProfile({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var profileState = context.watch<ProfileCubit>().state;
    if (profileState is! ProfileDersuRegistrationFinished) {
      return BrandLoader();
    }
    return Scaffold(
      appBar: AppBar(
        title: Text('Mi perfil'),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: BlocProvider(
          create: (context) => ProfileEditFormCubit(
            profile: profileState.profile,
            profileCubit: context.read<ProfileCubit>(),
          ),
          child: Builder(builder: (context) {
            final form = context.watch<ProfileEditFormCubit>();
            return BlocListener<ProfileEditFormCubit, FormCubitState>(
              listener: (context, state) {
                if (state.isSubmitted) {
                  Navigator.of(context).pop();
                }
              },
              child: Column(
                children: [
                  SizedBox(height: 40),
                  BrandTextField(
                    formFieldCubit: form.firstName,
                    label: LocaleKeys.registration_firstName.tr(),
                    isRequired: true,
                  ),
                  SizedBox(height: 20),
                  BrandTextField(
                    formFieldCubit: form.lastName,
                    label: LocaleKeys.registration_lastName.tr(),
                    isRequired: true,
                  ),
                  SizedBox(height: 20),
                  BrandButtons.primaryBig(
                      text: LocaleKeys.basis_accept.tr(),
                      onPressed:
                          form.state.isSubmitting || form.state.hasErrorToShow
                              ? null
                              : () => form.trySubmit())
                ],
              ),
            );
          }),
        ),
      ),
    );
  }
}
