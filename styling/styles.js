import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // for all 
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        paddingHorizontal: 15,
    },

    screen_container: {
        flex: 1,
        padding: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 8
    },
    

    headline: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
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
    },

    centeredButtonContainer: {
        justifyContent: 'center', // Center button horizontally
        alignItems: 'center', // Center button vertically
        width: '100%', // Use the full width of the parent container
        marginTop: 20, // Add some top margin
    },

    buttonStyle: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        width: 200, // specify width for the button
    },
    containerStyle: {
        width: 200,
        marginHorizontal: 50,
        marginVertical: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white', // Assuming you want white text
    },

    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Center items
        marginTop: 15,
        paddingHorizontal: 25, // Adjust padding as needed
    },

    // for Register Page
    registerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 25, // Adjust padding as needed
    },

    registerText: {
        color: 'grey',
        marginLeft: 50, // Increase spacing to the left of Register
        textDecorationLine: 'underline',
    },

    // for Forgot Password Page
    forgotPasswordText: {
        color: 'grey',
        textDecorationLine: 'underline',
        marginRight: 50, // Increase spacing to the right of Forgot Password
    },

    // for Forum Screen
    
    forum_input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 10,
    },
    forum_button: {
        borderRadius: 5,
        marginVertical: 10,
    },
    
    // for Add Habit Screen
    addhabit_input: {
        marginBottom: 20, 
        borderWidth: 1, 
        borderColor: 'gray',
        padding: 10,
    },

    addhabit_button: {
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    addhabit_buttonText: {
        color: 'white',
    },

    switchRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20,
    },
    switchText: {
        marginLeft: 10,
    },

    datePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
    },
    datePicker: {
        flex: 1,
        marginHorizontal: 5, // Adjust as needed
    },
    datePickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 25, // Adjust as needed
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
        backgroundColor: '#e6e6e6',
    },
    dropdownContainer: {
        width: '90%',
        alignSelf: 'center',
    },

    // for Calendar Screen
    completionText: {
      fontSize: 18,
      marginTop: 2,
      alignSelf: 'center',
      color: '#333', // Darker text color for contrast
    },
    chartContainer: {
      alignItems: 'center',
      marginTop: 30,
    },

    calendarContainer: {
        alignSelf: 'center',
        width: '95%',
        borderRadius: 10, // Rounded corners like the dropdown
        borderWidth: 1, // Add border
        borderColor: '#d3d3d3', // Light grey border color
        marginTop: 15,
        overflow: 'hidden' // This is important to make the rounded corners visible
    },

    // for Setting Screen
    setting_buttonStyle: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        backgroundColor: '#C70039'
    },
    
    setting_container: {
        flex: 1,
        padding: 10,
        paddingTop: 30, // Adjust as needed for the top spacing
    },
    
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20, // Space below the name
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
        marginBottom: 20, // Adjust as needed
    },
    iconContainer: {
        marginLeft: 5, // Adjust as needed
        marginBottom: 25
    },
    signOutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30, // Adjust as needed for bottom spacing
    },
});




