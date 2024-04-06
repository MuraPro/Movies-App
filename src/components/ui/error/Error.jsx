import React from 'react';
import { Alert } from 'antd';

function Error() {
  return (
    <Alert
      message="Ошибка!"
      description="При запросе произошла ошибка. Попробуйте снова. "
      type="error"
      showIcon
    />
  );
}

export default Error;
