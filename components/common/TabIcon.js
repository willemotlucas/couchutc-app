import React, { PropTypes } from 'react';
import { Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};

const TabIcon = (props) => {
	var iconName = "";
	switch(props.title) {
		case "Calendrier": iconName = "calendar-o";
		break;
		case "Rechercher": iconName = "search";
		break;
		case "Profil": iconName = "user";
		break;
		case "Messages": iconName = "comment-o";
		break;
	}

	return (
		<View style={{alignItems: 'center'}}>
			<Icon name={iconName} size={20} color={props.selected ? '#00A799' : 'grey'}/>
			<Text style={{ color: props.selected ? '#00A799' : 'grey' }} >
			    {props.title}
			</Text>
		</View>
	)
};

TabIcon.propTypes = propTypes;

export default TabIcon;
