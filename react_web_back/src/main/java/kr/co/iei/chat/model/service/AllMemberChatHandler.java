package kr.co.iei.chat.model.service;

import java.util.HashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.iei.chat.model.dto.ChatDTO;

@Component
public class AllMemberChatHandler extends TextWebSocketHandler{
	//전체채팅에 접속한 회원정보를 저장할 collection
	private HashMap<WebSocketSession, String> members;
	
	public AllMemberChatHandler() {
		super();
		members = new HashMap<WebSocketSession, String>();
	}

	//클라이언트가 소켓에 최초 접속하면 자동으로 호출되는 메소드
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("클라이언트 접속 : "+session);
	}

	//클라이언트가 소켓으로 데이터를 전송하면 자동으로 호출되는 메소드
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println(message.getPayload());
		//클라이언트가 보낸 메세지는 json -> 문자열로 변환해서 전송
		//문자열형태로 가지고있으면 구분해서 사용하기가 힘듦 -> JAVA의 객체형태로 변환
		ObjectMapper om = new ObjectMapper();
		ChatDTO chat = om.readValue(message.getPayload(), ChatDTO.class);		
		if(chat.getType().equals("enter")) {
			//채팅방에 입장
			members.put(session, chat.getMemberId());
			System.out.println("접속한 회원 수 : "+members.size());
			ChatDTO sendMessage = new ChatDTO();
			sendMessage.setType("enter");
			sendMessage.setMemberId(chat.getMemberId());
			String data = om.writeValueAsString(sendMessage);
			TextMessage sendData = new TextMessage(data);
			for(WebSocketSession s : members.keySet()) {
				s.sendMessage(sendData);
			}
		} else if (chat.getType().equals("chat")) {
			//서버에서 클라이언트로 데이터 전송
			ChatDTO sendMessage = new ChatDTO();
			sendMessage.setType("chat");
			sendMessage.setMemberId(chat.getMemberId());
			sendMessage.setMessage(chat.getMessage());
			//객체를 문자열로 변환
			String data = om.writeValueAsString(sendMessage);
			TextMessage sendData = new TextMessage(data);
			//members에 저장된 회원(전체채팅에 저장된 회원 모두에게 메세지를 전달)
			for(WebSocketSession s : members.keySet()) {
				s.sendMessage(sendData);
			}
		}
		
	}

	//클라이언트가 소켓에서 접속이 끊어지면 자동으로 호출되는 메소드
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("클라이언트 접속 끊김 : "+session);
		ObjectMapper om = new ObjectMapper();
		ChatDTO sendData = new ChatDTO();
		sendData.setType("out");
		sendData.setMemberId(members.get(session));
		//접속이 끊어진 회원은 접속회원목록에서 삭제
		members.remove(session);
		String data = om.writeValueAsString(sendData);
		TextMessage sendMessage = new TextMessage(data);
		for(WebSocketSession s : members.keySet()) {
			s.sendMessage(sendMessage);
		}
	}
}
