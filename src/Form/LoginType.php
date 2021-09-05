<?php

    declare(strict_types=1);

namespace Bolt\Form;

    use Bolt\Form\FieldTypes\PasswordWithPreviewType;
    use Symfony\Component\Form\AbstractType;
    use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
    use Symfony\Component\Form\Extension\Core\Type\TextType;
    use Symfony\Component\Form\FormBuilderInterface;
    use Symfony\Component\OptionsResolver\OptionsResolver;
    use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
    use Symfony\Component\Validator\Constraints\NotBlank;
    use Symfony\Contracts\Translation\TranslatorInterface;

    class LoginType extends AbstractType
    {
        /** @var AuthenticationUtils */
        private $authenticationUtils;

        /** @var TranslatorInterface */
        private $translator;

        public function __construct(AuthenticationUtils $authenticationUtils, TranslatorInterface $translator)
        {
            $this->authenticationUtils = $authenticationUtils;
            $this->translator = $translator;
        }

        public function buildForm(FormBuilderInterface $builder, array $options): void
        {
            $builder
                ->add('username', TextType::class, [
                    'label' => 'label.username_or_email',
                    'constraints' => [
                        new NotBlank([
                            'message' => $this->translator->trans('form.empty_username_email'),
                        ]),
                    ],
                    'attr' => [
                        'placeholder' => 'placeholder.username_or_email',
                    ],
                    'data' => $this->authenticationUtils->getLastUsername(),
                ])
                ->add('password', PasswordWithPreviewType::class, [
                    'label' => 'label.password',
                    'constraints' => [
                        new NotBlank([
                            'message' => $this->translator->trans('form.empty_password'),
                        ]),
                    ],
                    // do not show the * red star
                    'required' => false,
                    'attr' => [
                        'placeholder' => 'placeholder.password',
                    ],
                ])->add('remember_me', CheckboxType::class, [
                    'label' => 'label.rememberme',
                    'required' => false,
                ]);
        }

        // https://symfony.com/doc/current/security/csrf.html#csrf-protection-in-symfony-forms
        public function configureOptions(OptionsResolver $resolver): void
        {
            $resolver->setDefaults([
                // enable/disable CSRF protection for this form
                'csrf_protection' => true,
                // the name of the hidden HTML field that stores the token
                'csrf_field_name' => '_token',
                // an arbitrary string used to generate the value of the token
                // using a different string for each form improves its security
                'csrf_token_id' => 'login_csrf_token',
            ]);
        }
    }
