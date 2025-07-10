import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ChatBubble from '../components/chatbubble';
import colors from '../styles/colors';
import fonts from '../styles/gloabalstyles';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Mock chat data
  const mockMessages = [
    {
      id: '1',
      message: 'Hello! I saw your PG listing. Is it still available?',
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 30).toISOString(),
      isRead: true,
    },
    {
      id: '2',
      message: 'Yes, it is! Would you like to schedule a visit?',
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 25).toISOString(),
    },
    {
      id: '3',
      message: 'That would be great! What time works for you?',
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 20).toISOString(),
      isRead: true,
    },
    {
      id: '4',
      message: 'How about tomorrow at 3 PM? I can show you around.',
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
    },
    {
      id: '5',
      message: 'Perfect! What\'s the address?',
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 10).toISOString(),
      isRead: false,
    },
    {
      id: '6',
      message: '123 Main Street, Near Metro Station. I\'ll send you the exact location.',
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
    },
  ];

  useEffect(() => {
    // Simulate loading messages
    const timer = setTimeout(() => {
      setMessages(mockMessages);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      message: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Thank you for your message!',
        'I\'ll get back to you shortly.',
        'Let me check that for you.',
        'Sure, I can help with that.',
        'That sounds good to me.',
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        message: randomResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }) => {
    if (item.isTyping) {
      return <ChatBubble isTyping={true} />;
    }

    return (
      <ChatBubble
        message={item.message}
        isUser={item.isUser}
        timestamp={item.timestamp}
        isRead={item.isRead}
      />
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return <ChatBubble isTyping={true} />;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.gold} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={colors.gold} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>PG Owner</Text>
            <Text style={styles.userStatus}>Online</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert('Call', 'Feature coming soon!')}
        >
          <Ionicons name="call" size={24} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color={colors.darkGray} />
            <Text style={styles.emptyText}>Start your conversation</Text>
            <Text style={styles.emptySubtext}>Send a message to get started</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        
        {renderTypingIndicator()}
      </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.lightGray}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => Alert.alert('Attachment', 'Feature coming soon!')}
          >
            <Ionicons name="attach" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() === '' && styles.disabledSendButton]}
          onPress={handleSend}
          disabled={inputText.trim() === ''}
        >
          <Ionicons name="send" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  userStatus: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gold,
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.lightGray,
    marginTop: 8,
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.black,
    borderTopWidth: 1,
    borderTopColor: colors.darkGray,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.darkGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.white,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  attachButton: {
    marginLeft: 10,
    padding: 5,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: colors.darkGray,
  },
});

export default ChatScreen;