import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import {AtButton, AtCalendar, AtList, AtListItem} from 'taro-ui'
import './index.scss'
import {useEffect, useState} from "react";

interface FoodItem {
  name: string;
  expirationDate: string;
}

interface DishItem {
  name: string;
  expirationDate: string;
  thumb?: string;
  category: string;
}

export default function Index() {
  const [today, setToday] = useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [dishList, setDishList] = useState<DishItem[]>([]);


  useEffect(() => {
    const mockData: FoodItem[] = [
      { name: 'Expired Milk   margin-right: auto; /* This will push the note to the left from the end of the container, centering it */', expirationDate: '04/15/2024' },
      { name: 'This Bread', expirationDate: '09/30/2024' },
      { name: 'Next Bread', expirationDate: '10/01/2024' },
      { name: 'Eggs', expirationDate: '04/25/2025' },
    ];
    const mockDishesData: DishItem[] = [
      { name: '黄焖鸡', expirationDate: '10/01/2024',  category: '#家常菜 #调料包'},
      { name: '梅菜扣肉', expirationDate: '10/01/2024',  category: '#预制菜'},
      { name: '蛋炒饭', expirationDate: '10/01/2024',  category: '#家常菜 #主食'},
      { name: '可乐鸡翅', expirationDate: '10/01/2024',  category: '#家常菜'},
    ];

    // setFoodList(mockData)
    setFoodList(mockData.filter((item) => {
      const expirationDate = parseDate(item.expirationDate, 'MM/DD/YYYY')
      return expirationDate != null && expirationDate >= today
    }));
    setDishList(mockDishesData);
  }, [!!today]);

  useLoad(() => {
    console.log('Page loaded.')
  })

  const parseDate = (dateString: string, formatString: string): Date | null => {
    const date =  new Date(Date.parse(dateString));
    if (isNaN(date.getTime())) {
      console.error("Invalid date format");
      return null;
    }

    return date;
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
  };

  const getWeekRange = (today: Date = new Date()): {start: string, end: string} => {
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - dayOfWeek);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek)
    };
  }

  const getMonthRange = (today: Date = new Date()): {start: string, end: string} => {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    return {
      start: formatDate(startOfMonth),
      end: formatDate(endOfMonth)
    };
  }

  const differenceInDays = (thisDate: Date, thatDate: Date): number => {
    let differenceInMilliseconds = thatDate.getTime() - thisDate.getTime();
    return Math.floor(differenceInMilliseconds / (1000 * 3600 * 24))
  }

  const getFoodItemNoteMessage = (expDateString: string): string => {
    const expDate = parseDate(expDateString, 'MM/DD/YYYY')
    if (expDate == null) {
      return 'Error Expiration'
    }

    const diffDate = differenceInDays(today, expDate)
    if (diffDate < 2) {
      return `Expire in ${diffDate} day`
    } else {
      return `Expire in ${diffDate} days`
    }
  }

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <AtButton type='primary'>提交</AtButton>
      <AtCalendar
        isSwiper
        isMultiSelect currentDate={{start: getWeekRange(today).start, end: getWeekRange(today).end}}
        minDate={getMonthRange(today).start} maxDate={getMonthRange(today).end}
        marks={[ { value: formatDate(today) } ]}
        hideArrow='false'
      />

      <AtList>
        {foodList.map((food, index) => (
          <AtListItem
            key={index}
            title={food.name}
            note={`${getFoodItemNoteMessage(food.expirationDate)}`}
            arrow="left"
            className="list-item"
          />
        ))}
      </AtList>

      <AtList>
        {dishList.map((dish, index) => (
          <AtListItem
            key={index}
            title={dish.name}
            note={dish.expirationDate}
            arrow="left"
            className="list-item"
          />
        ))}
      </AtList>
    </View>
  )
}
