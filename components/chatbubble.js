import { StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/gloabalstyles';

const ChatBubble = ({ 
  message, 
  isUser = false, 
  timestamp, 
  isRead = false,
  isTyping = false 
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (isTyping) {
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, styles.typingBubble]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isUser && styles.userContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.otherText]}>
          {message}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.otherTimeText]}>
            {formatTime(timestamp)}
          </Text>
          {isUser && (
            <View style={styles.readIndicator}>
              <View style={[styles.checkMark, isRead && styles.readCheckMark]} />
              <View style={[styles.checkMark, styles.secondCheck, isRead && styles.readCheckMark]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 15,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: colors.gold,
    borderBottomRightRadius: 5,
    marginLeft: 50,
  },
  otherBubble: {
    backgroundColor: colors.darkGray,
    borderBottomLeftRadius: 5,
    marginRight: 50,
  },
  typingBubble: {
    backgroundColor: colors.darkGray,
    borderBottomLeftRadius: 5,
    marginRight: 50,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  messageText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    lineHeight: 22,
    marginBottom: 5,
  },
  userText: {
    color: colors.black,
  },
  otherText: {
    color: colors.white,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    opacity: 0.7,
  },
  userTimeText: {
    color: colors.black,
  },
  otherTimeText: {
    color: colors.lightGray,
  },
  readIndicator: {
    flexDirection: 'row',
    marginLeft: 5,
    position: 'relative',
  },
  checkMark: {
    width: 10,
    height: 5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.black,
    transform: [{ rotate: '-45deg' }],
    opacity: 0.7,
  },
  secondCheck: {
    position: 'absolute',
    left: 3,
  },
  readCheckMark: {
    borderColor: colors.darkGray,
    opacity: 1,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGray,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});

export default ChatBubble;