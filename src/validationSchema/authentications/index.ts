import * as yup from 'yup';

export const authenticationValidationSchema = yup.object().shape({
  wifi_hotspot: yup.string().required(),
  sms_settings: yup.string().required(),
  user_id: yup.string().nullable(),
});
