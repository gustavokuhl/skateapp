import { Image, Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import HiveBlog from "../home/Feed/Feed";
import HiveBalanceDisplay2 from "../wallet/hive/hiveBalance";
import { useParams } from 'react-router-dom';
import { Client } from "@hiveio/dhive";

interface AuthorProfile {
  about?: string;
  cover_image?: string;
  location?: string;
  name?: string;
  // Add other properties of the profile if needed
}

interface Author {
  name?: string;
  posting_json_metadata?: string;
  profile?: AuthorProfile;
}

const DEFAULT_COVER_IMAGE_URL = 'https://i.ibb.co/r20bWsF/You-forgot-to-add-a-cover.gif';

export default function AuthorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [coverImageUrl, setCoverImageUrl] = useState<string>(DEFAULT_COVER_IMAGE_URL);
  const [account, setAccount] = useState<string | null>(null); // Step 2
  const [authorAbout, setAuthorAbout] = useState<string | null>(null); // Step 3
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (username) {
        try {
          
          const client = new Client('https://api.hive.blog'); 
          const account = await client.database.getAccounts([username]);
          console.log('ACCOUNT',account)
          setAccount(account[0].name);
          const metadata = JSON.parse(account[0].posting_json_metadata) as Author;
          console.log('METADATA',metadata)
          const authorAbout = metadata.profile?.about || null;
          console.log('ABOUT', authorAbout);
          const coverImage = metadata.profile?.cover_image || DEFAULT_COVER_IMAGE_URL;
          setCoverImageUrl(coverImage);
          setAuthorAbout(authorAbout);
        } catch (error) {
          console.error('Error fetching author metadata:', error);
        }
      }
    };

    fetchAccountInfo();
  }, [username]);

  const [accountReputation, setAccountReputation] = useState<number | null>(null); // Step 2
  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const client = new Client('https://api.hive.blog');
          const response = await client.call('condenser_api.get_account_reputations', username, 1);
          console.log('USERNAME',username)
          console.log('Response:', response)
          if (response && response.length > 0) {
            const reputation = response[0]?.reputation || null;
        
            // Fetch additional account metadata if needed
            const account = await client.database.getAccounts([username]);
            const metadata = JSON.parse(account[0].posting_json_metadata) as Author;
            const coverImage = metadata.profile?.cover_image || DEFAULT_COVER_IMAGE_URL;
            setCoverImageUrl(coverImage);
            setAccountReputation(reputation);
          } else {
            console.error('Invalid response from API:', response);
          }
        } catch (error) {
          console.error('Error fetching author metadata:', error);
        }
        
      }
    };


    fetchData();
  }, [username]);
  return (
    <Box
      fontFamily="'Courier New', monospace"
      position="relative"
      overflow="hidden"
      maxWidth="100%"  // Set a max width for the image container
      margin="0 auto"     // Center align the image container
    >
      <Image src={coverImageUrl} alt="Cover Image" maxH="240px" width="100%" objectFit="cover" />
      <Flex alignItems="center" justifyContent="center" padding="10px" position="relative" zIndex="1">
        <Box
          position="absolute"
          left="50%"
          transform="translate(-50%, -50%)"
          borderRadius="20%"
          border="2px solid limegreen"
          boxSize="192px"
          bg="white"
          boxShadow="0px 2px 6px rgba(0, 0, 0, 0.1)"
        >
          <Image
            src={`https://images.hive.blog/u/${username}/avatar`}
            alt="profile avatar"
            borderRadius="20%"
            boxSize="192px"
          />
        </Box>
      </Flex>
      <Box marginTop={"10px"}>
        <Flex
          backgroundColor="black"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Tabs variant={"soft-rounded"}>
            <TabList justifyContent="center"> {/* Center align the TabList */}
              <Tab>Blog</Tab>
              <Tab>About</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <HiveBlog tag={username} queryType={"blog"} />
              </TabPanel>
              <TabPanel>
              <p>Account : {account}</p> {/* Step 5: Display the account reputation */}
              <p>About: {authorAbout} </p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </Box>
  );
}
