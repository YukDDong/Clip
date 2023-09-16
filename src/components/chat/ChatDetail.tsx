import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

import { client } from '@/apis';
import ChatDetailBody from '@/components/chat/chatDetail/ChatDetailBody';
import ChatDetailHeader from '@/components/chat/chatDetail/ChatDetailHeader';
import ChatSend from '@/components/chat/chatDetail/ChatSend';

export type Msg = {
  sender: string;
  content: string;
};

type UserInfo = {
  userId: number;
  userName: string;
};

type ProductInfo = {
  productId: number;
  productName: string;
};

type SellerInfo = {
  sellerId: number;
  shopName: string;
};

type ChatUserProps = {
  customRoomId: string | null;
  role: string;
  seller: SellerInfo;
  user: UserInfo;
  product: ProductInfo;
  clickPrevButton: () => void;
  handleOpen: () => void;
};

/** stompClient() : 서버랑 연결할 클라이언트 객체 생성 */
const stompClient = new Client({
  brokerURL: `${import.meta.env.VITE_API_CHAT_URL}/chat`,
});

const ChatDetail = ({
  customRoomId,
  role,
  seller,
  user,
  product,
  clickPrevButton,
  handleOpen,
}: ChatUserProps) => {
  // 지금부터 보낼 메세지 담기
  const [msg, setMsg] = useState<Msg[]>([]);
  // 이전의 메세지 기록 담기
  const [prevMsg, setPrevMsg] = useState<Msg[]>([]);
  // 떠난 판매자 또는 유저 name
  const [leaveUser, setLeaveUser] = useState<string>('');
  // 판매자, 유저 전부 채팅방 떠났는지 확인
  const [userStatus, setUserStatus] = useState({
    [user.userName]: false,
    [seller.shopName]: false,
  });

  const loadPrevChat: () => Promise<void> = async () => {
    await client
      .get(`/v1/api/chat/detail/${customRoomId}`)
      .then((res) => {
        console.log(res);
        const prev = res.data.chats;
        const msgArray: Msg[] = Object.values(prev);
        setPrevMsg([...msgArray]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadPrevChat();
  }, []);

  /** sendMessage() : 유저가 상대방에게 메세지 보낼때 */
  const sendMessage = (text: string) => {
    const messageContent = text;
    if (messageContent && stompClient) {
      const chatMessage = {
        customRoomId: customRoomId,
        sender: role === 'user' ? user.userName : seller.shopName,
        content: messageContent,
        type: 'CHAT',
      };
      stompClient.publish({
        destination: `/app/chat.sendMessage/${seller.sellerId}/${product.productId}/${user.userId}`,
        body: JSON.stringify(chatMessage),
      });
    }
  };

  /** handleLeave() : 유저가 채팅방을 떠날 때 */
  const handleLeave = () => {
    stompClient.publish({
      destination: `/topic/${seller.sellerId}/${product.productId}/${user.userId}`,
      body: JSON.stringify({
        shopName: seller.shopName,
        userName: user.userName,
        sender: role === 'user' ? user.userName : seller.shopName,
        type: 'LEAVE',
      }),
    });
    //TODO: 창 닫기 적용하기
  };

  /** handleTerminate() : 유저, 셀러 전부 떠났을때 */
  const handleTerminate = () => {
    stompClient.publish({
      destination: `/topic/${seller.sellerId}/${product.productId}/${user.userId}`,
      body: JSON.stringify({
        shopName: seller.shopName,
        userName: user.userName,
        type: 'TERMINATE',
      }),
    });
  };

  useEffect(() => {
    if (userStatus[user.userName] && userStatus[seller.shopName]) {
      handleTerminate();
    }
  }, [userStatus]);

  /** handleDisConnect() : 소켓 객체 비활성화(끊기) */
  const handleDisConnect = () => {
    if (stompClient.connected) {
      // 전역에 만들어진 클라이언트 소켓 객체를 연결 종료하고 삭제.
      stompClient.deactivate();
      console.log('연결이 끊겼습니다.');
    }
  };

  // 처음 들어왔을때 joinMessage를 보내서 stompClient연결
  useEffect(() => {
    const joinMessage = {
      customRoomId: customRoomId,
      shopName: seller.shopName,
      userName: user.userName,
      role: role,
      type: 'JOIN',
    };

    // 연결이 된 경우 콜백함수 호출(어떻게 동작할지 정의)
    stompClient.onConnect = () => {
      // 구독하기(메세지 받음)
      stompClient.subscribe(
        `/topic/${seller.sellerId}/${product.productId}/${user.userId}`,
        (body) => {
          // message -> 백엔드랑 논의 완료 (백엔드에서 어떻게 보내주는지)
          const message = JSON.parse(body.body);

          if (message.type === 'JOIN') {
            console.log('연결되었습니다.');
          } else if (message.type === 'LEAVE') {
            const leave = message.sender;
            setLeaveUser(leave);
            setUserStatus((prevUserStatus) => ({
              ...prevUserStatus,
              [message.sender]: true, // 해당 유저의 상태를 입장으로 설정
            }));
          } else if (message.type === 'TERMINATE') {
            handleDisConnect();
          } else {
            const msgContent = message.content;
            const msgSender = message.sender;
            const msg1 = { content: msgContent, sender: msgSender };
            setMsg((prev) => [...prev, msg1]);
          }
        },
      );

      // 소켓 통신 호출 - 목적지 url로 메시지 보내기 (ex)JOIN 하기, 방떠나기!
      stompClient.publish({
        destination: `/app/chat.addUser/${seller.sellerId}/${product.productId}/${user.userId}`,
        body: JSON.stringify(joinMessage),
      });
    };

    // 에러가 나오는 경우 어떻게 동작할지 정의 - 콜백함수 호출
    stompClient.onStompError = (frame) => {
      // TODO: 어떻게 에러를 유저에게 안내해줄지 고민
      console.log('연결 실패', frame);
    };

    // 전역에 만들어진 클라이언트 소켓 객체 활성화(연결)
    stompClient.activate();

    return () => {
      handleDisConnect();
    };
  }, []);

  return (
    <>
      <ChatDetailHeader
        handleLeave={handleLeave}
        shopName={seller.shopName}
        clickPrevButton={clickPrevButton}
        handleOpen={handleOpen}
      />
      <ChatDetailBody
        prevMsg={prevMsg}
        msg={msg}
        nickName={role === 'user' ? user.userName : seller.shopName}
        leaveUser={leaveUser}
        shopName={seller.shopName}
      />
      <ChatSend sendMessage={sendMessage} />
    </>
  );
};

export default ChatDetail;