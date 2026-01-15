import React from 'react';
import {View} from 'react-native';
import Colors from '../constants/Colors';

export default function Separator(props) {
    return (
        <View
            style={{
                borderBottomColor: Colors.border,
                borderBottomWidth: 1,
            }}
        />
    );
}
