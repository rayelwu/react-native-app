import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SelectInput from '@/components/ui/SelectInput';
import UserListItem from '@/components/UserListItem';

// Define the contact type
type Contact = {
  id: string;
  name: string;
  avatar: string;
  status?: string;
};

// Define the group type
type Group = {
  id: string;
  icon: React.ReactNode;
  title: string;
  count: number;
  contacts: Contact[];
  expanded?: boolean;
};


const groupData = require('@/assets/data/groups.json');
const userData = require('@/assets/data/users.json');


export default function ContactScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(userData.map((user: any) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    status: user.status
  })));

  const [groups, setGroups] = useState<Group[]>(groupData.map((group: any) => ({
    id: group.id,
    icon: group.icon,
    title: group.title,
    count: group.contacts.length,
    contacts: group.contacts.map((contact: string) => {
      const user = userData.find((user: any) => user.id === contact);
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        status: user.status
      };
    })
  })));
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('contact');

  // Toggle group expansion
  const toggleGroup = (id: string) => {
    setGroups(groups.map(group =>
      group.id === id ? { ...group, expanded: !group.expanded } : group
    ));
  };

  // Prepare data for FlatList
  const getListData = () => {
    let data: (Group | Contact & { groupId?: string })[] = [];

    if (selectedTab === 'contact') {
      // When in Contact tab, show all contacts directly
      return contacts;
    } else {
      // When in Group tab, only show groups
      return groups;
    }
  };

  // Render each item (group or contact)
  const renderItem = ({ item }: { item: any }) => {
    // If item has a groupId, it's a contact
    if (selectedTab === 'contact') {
      return (
        <UserListItem
          id={item.id}
          name={item.name}
          avatar={item.avatar}
          status={item.status}
          onPress={(id) => router.push({
            pathname: '/chat',
            params: { sender: id }
          })}
        />
      );
    }

    // Otherwise it's a group
    return (
      <TouchableOpacity
        style={styles.groupItem}
        onPress={() => selectedTab === 'contact' ? toggleGroup(item.id) : router.push(`/group-detail?id=${item.id}`)}
      >
        <View style={styles.iconContainer}>
          <Image source={{ uri: item.icon }} style={{
            width: 24,
            height: 24,
            borderRadius: 12,
          }} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.count}>{item.count}</Text>
          {selectedTab === 'contact' && (
            <FontAwesome
              name={item.expanded ? "chevron-down" : "chevron-right"}
              size={16}
              color="#C0C0C0"
              style={styles.chevron}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Handle menu item selection
  const handleMenuItemPress = (action: string) => {
    setMenuVisible(false);

    if (action === 'createGroup') {
      router.push('/create-group');
    } else if (action === 'createContact') {
      // Navigate to create contact screen (you'll need to create this)
      router.push('/create');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'contact' && styles.activeTab]}
            onPress={() => setSelectedTab('contact')}
          >
            <Text style={[styles.tabText, selectedTab === 'contact' && styles.activeTabText]}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'group' && styles.activeTab]}
            onPress={() => setSelectedTab('group')}
          >
            <Text style={[styles.tabText, selectedTab === 'group' && styles.activeTabText]}>Groups</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <FontAwesome name="plus" size={20} color="#0088ff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={getListData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* Dropdown Menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('createContact')}
                >
                  <FontAwesome name="user-plus" size={16} color="#a1a1a1" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Create Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('createGroup')}
                >
                  <FontAwesome name="users" size={16} color="#a1a1a1" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Create Group</Text>
                </TouchableOpacity>


              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
    padding: 2,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6E7781',
  },
  activeTabText: {
    color: '#0088ff',
    fontWeight: '600',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 60,
    marginRight: 20,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 15,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e1e4e8',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  count: {
    fontSize: 14,
    color: '#6E7781',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '500',
  },
  contactStatus: {
    fontSize: 13,
    marginTop: 2,
  },
});
