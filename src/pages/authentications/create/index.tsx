import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createAuthentication } from 'apiSdk/authentications';
import { Error } from 'components/error';
import { authenticationValidationSchema } from 'validationSchema/authentications';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { AuthenticationInterface } from 'interfaces/authentication';

function AuthenticationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AuthenticationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAuthentication(values);
      resetForm();
      router.push('/authentications');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AuthenticationInterface>({
    initialValues: {
      wifi_hotspot: '',
      sms_settings: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: authenticationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Authentication
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="wifi_hotspot" mb="4" isInvalid={!!formik.errors?.wifi_hotspot}>
            <FormLabel>Wifi Hotspot</FormLabel>
            <Input type="text" name="wifi_hotspot" value={formik.values?.wifi_hotspot} onChange={formik.handleChange} />
            {formik.errors.wifi_hotspot && <FormErrorMessage>{formik.errors?.wifi_hotspot}</FormErrorMessage>}
          </FormControl>
          <FormControl id="sms_settings" mb="4" isInvalid={!!formik.errors?.sms_settings}>
            <FormLabel>Sms Settings</FormLabel>
            <Input type="text" name="sms_settings" value={formik.values?.sms_settings} onChange={formik.handleChange} />
            {formik.errors.sms_settings && <FormErrorMessage>{formik.errors?.sms_settings}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'authentication',
    operation: AccessOperationEnum.CREATE,
  }),
)(AuthenticationCreatePage);
