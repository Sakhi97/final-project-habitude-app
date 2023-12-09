import { StyleSheet } from 'react-native';


export const darkTheme = {
    background: '#303030',
    text: '#FFFFFF',
    borderColor: '#909090',
    linkText: '#BBBBBB',
    buttonBackground: '#FF6633',
    signOutButtonBackground: '#900C3F',
    dropdownBackground: '#333333',
    chartBorder: '#555555',
};
export const lightTheme = {
    background: '#f4f4f4',
    text: '#000000',
    borderColor: 'grey',
    linkText: 'grey',
    buttonBackground:'#3399CC',
    signOutButtonBackground: '#C70039',
    dropdownBackground: '#e6e6e6',
    chartBorder: '#d3d3d3',
};

const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        paddingHorizontal: 15,
        backgroundColor: colors.background,
    },
    containerTab: {
        backgroundColor: colors.background,
    },
    screen_container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginBottom: 10,
        padding: 8,
        color: colors.text,
    },
    dateText: {
        padding: 10, 
        fontSize: 18, 
        fontWeight: 'bold', 
        alignSelf: 'center',
        color: colors.text,
    },
    headline: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: colors.text,
    },
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    centeredButtonContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        marginTop: 20, 
    },
    buttonStyle: {
        borderWidth: 2,
        borderColor: colors.borderColor,
        borderRadius: 30,
        width: 200,
        backgroundColor: colors.buttonBackground,
    },

    stripeCalendarStyle: { 
        height: 100, 
        paddingTop: 20, 
        paddingBottom: 10,
        backgroundColor: colors.background
    },
    containerStyle: {
        width: 200,
        marginHorizontal: 50,
        marginVertical: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white', 
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        marginTop: 25,
        paddingHorizontal: 25, 
    },
    linkText: {
        color: colors.linkText,
        textDecorationLine: 'underline',
        marginRight: 50, 
    },
    registerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 25, 
    },

    // for Forum dcreen
    forum_input: {
        borderWidth: 1,
        borderColor: colors.borderColor,
        padding: 10,
        marginVertical: 10,
        color: colors.text,
    },
    forum_button: {
        borderRadius: 5,
        marginVertical: 10,
    },
    
    // for Add Habit Screen
    addhabit_input: {
        marginBottom: 20, 
        borderWidth: 1,
        borderColor: colors.borderColor,
        padding: 10,
        color: colors.text,
    },

    addhabit_button: {
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    addhabit_buttonText: {
        color: colors.text,
    },

    switchRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20,
    },
    switchText: {
        marginLeft: 10,
        color: colors.text
    },

    datePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
    },
    datePicker: {
        flex: 1,
        marginHorizontal: 5,
        color: colors.text,
    },
    datePickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 25,
        color: colors.text,
    },
    picker: {
        marginBottom: 20,
    },
    dropdown: {
        height: 50,
        width: '95%',
        marginBottom: 15,
        marginTop: 15,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#e0e0eb',
    },

    dropdownContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    
    completionText: {
        fontSize: 18,
        marginTop: 2,
        alignSelf: 'center',
        color: colors.text,
    },
    chartContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    calendarContainer: {
        alignSelf: 'center',
        width: '95%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.chartBorder,
        marginTop: 15,
        overflow: 'hidden',
    },

    // for Setting Screen
    setting_buttonStyle: {
        borderWidth: 2,
        borderColor: colors.borderColor,
        borderRadius: 30,
        backgroundColor: colors.signOutButtonBackground,
    },
    setting_container: {
        flex: 1,
        padding: 10,
        paddingTop: 30, 
        backgroundColor: colors.background,
    },
   
    setting_nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20, 
        color: colors.text,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, 
    },
    iconContainer: {
        marginLeft: 5, 
        marginBottom: 25
    },
    signOutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30, 
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
});

export const lightThemeStyles = createStyles(lightTheme);
export const darkThemeStyles = createStyles(darkTheme);






