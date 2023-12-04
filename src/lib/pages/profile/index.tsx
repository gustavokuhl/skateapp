import { Image, Box, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Modal, ModalBody, ModalCloseButton, ModalOverlay, ModalContent,ModalFooter, ModalHeader } from "@chakra-ui/react";
import useAuthUser from "../home/api/useAuthUser";
import React, { useEffect, useState } from 'react';
import HiveBlog from "../home/Feed/Feed";
import BeCool from "./beCool";
import HiveBalanceDisplay2 from "../wallet/hive/hiveBalance";
interface User {
  name?: string;
  posting_json_metadata?: string;
  created?: string;
  post_count?: string;
}
interface Follower {
  follower: string;
}

interface Following {
  following: string;
  follower: string;
}


const DEFAULT_AVATAR_URL = "https://i.gifer.com/origin/f1/f1a737e4cfba336f974af05abab62c8f_w200.gif";
const DEFAULT_COVER_IMAGE_URL = 'https://i.ibb.co/r20bWsF/You-forgot-to-add-a-cover.gif';


interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Add your form or content for editing the profile here */}
          <Text>Modal content goes here...</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          {/* Add save or update button as needed */}
          <Button variant="ghost">Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};



export default function ProfilePage() {
  const { user } = useAuthUser() as { user: User | null };
  const [coverImageUrl, setCoverImageUrl] = useState<string>(DEFAULT_COVER_IMAGE_URL);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchCoverImage = async () => {
      if (user) {
        try {
        const metadata = JSON.parse(user.posting_json_metadata || '');
        const coverImage = metadata.profile.cover_image;

        if (coverImage) {
          setCoverImageUrl(coverImage);
          return;
        }
        } catch (error) {
          console.error('Error parsing JSON metadata:', error);
        }
      }
    };

    fetchCoverImage();
  }, [user]);
  const UserAbout = () => {
    if (user) {
      try {
        const metadata = JSON.parse(user.posting_json_metadata || '');
        const about = metadata.profile.about;
        console.log("zacks brain: " , user)
        const website = metadata.profile.website;
        const created = user.created;
        const postings = user.post_count;
        const location = metadata.profile.location;
        const displayname = metadata.profile.name;
        
        return (
          <Box border={"1px solid limegreen"} p={10} borderRadius={20}>
            <Text fontSize={32} color={"white"}>{displayname}</Text>
            <Text fontSize={32} color={"white"}>{about}</Text>
            <Text fontSize={32} color={"white"}>{website}</Text>
            <Text fontSize={32} color={"white"}>Account created: {created}</Text>
            <Text fontSize={32} color={"white"}>Posts and Comments: {postings}</Text>
            <Text fontSize={32} color={"white"}>Country: {location}</Text>
            
          </Box>
        );
      } catch (error) {
        return <Text>Can't find a description.</Text>;
      }
    } else {
      return "No user";
    }
  }
  const editClick = () => {
    setIsEditModalOpen(true);
  }

  return (
    <Box
    fontFamily="'Courier New', monospace"
    position="relative"
    overflow="hidden"
    maxWidth="100%"  
    margin="0 auto"  
    backgroundColor={"transparent"}
    > 
   

      <Image src={coverImageUrl} alt="Cover Image" maxH="340px" width="100%" objectFit="cover"  border={"0px solid "} />

      <Flex alignItems="center" justifyContent="center" padding="10px" position="relative" zIndex="1">
        <Box
          position="absolute"
          left="50%"
          transform="translate(-50%, -65%)"
          borderRadius="10%"
          boxSize="162px"
          bg="transparent"
          boxShadow="0px 2px 6px rgba(0, 0, 0, 0.1)"
        >
          {user ? (
            <Image
              src={`https://images.hive.blog/u/${user.name}/avatar`}
              alt="profile avatar"
              borderRadius="50%"
              boxSize="162px"
              border="7px solid limegreen"
              
            />
          ) : (
            <Image
              src={DEFAULT_AVATAR_URL}
              alt="Default Avatar"
              borderRadius="10%"
              boxSize="162px"
              border="2px solid limegreen"
            />
          )}
        </Box>
        {/* <Button>
          Edit Profile
        </Button> */}

        
      </Flex>

      <Tabs isLazy variant={"unstyled"}  colorScheme="green" >
  <TabList  color={"white"} justifyContent="center"  >
  
    <Tab borderRadius={"10px"} border={"2px solid "} _selected={{ color: 'black', bg: 'green.500' }}>Posts</Tab>
    <Tab borderRadius={"10px"} border={"2px solid "} _selected={{ color: 'black', bg: 'green.500' }}>About</Tab>
    <Tab borderRadius={"10px"} border={"2px solid "} _selected={{ color: 'black', bg: 'green.500' }}>Stats</Tab>
    <Tab borderRadius={"10px"} border={"2px solid "} _selected={{ color: 'black', bg: 'green.500' }}>Wallet</Tab>
    

  </TabList>
        <TabPanels>
          <TabPanel>
            {user && <HiveBlog tag={user.name} queryType={"blog"} />}
          </TabPanel>
          <TabPanel>
          <UserAbout/>
            </TabPanel>
            <TabPanel>
            <BeCool/>
            </TabPanel>
            <TabPanel display="flex" justifyContent="center">
            <HiveBalanceDisplay2/>
            </TabPanel>
            
        </TabPanels>
      </Tabs>
      {isEditModalOpen && <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />}

    </Box>
  );
}
