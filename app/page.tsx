"use client";

import { DatePicker, Space } from 'antd';
import { DatePickerProps } from 'antd/es/date-picker';

const Page = () =>{
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <>
      <div>
        <Space>
          <DatePicker onChange={onChange} picker='month' />
        </Space>
      </div>
    </>
  )
}

export default Page;