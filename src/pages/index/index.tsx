import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import {AtButton, AtCalendar} from 'taro-ui'
import './index.scss'

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <AtButton type='primary'>提交</AtButton>
      <AtCalendar
        isSwiper
        isMultiSelect currentDate={{start: '2024/9/22', end: '2024/9/28'}}
        minDate="2024/9/1" maxDate="2024/9/30"
        marks={[ { value: '2024/9/27' } ]}
        hideArrow="false"
      />
    </View>
  )
}
