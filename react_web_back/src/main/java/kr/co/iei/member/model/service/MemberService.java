package kr.co.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.dto.LoginMemberDTO;
import kr.co.iei.member.model.dto.MemberDTO;
import kr.co.iei.util.JwtUtils;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private JwtUtils jwtUtil;
	
	@Transactional
	public int insertMember(MemberDTO member) {
		String encPw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
		int result = memberDao.insertMember(member);
		return result;
	}

	public int checkId(String memberId) {
		int result = memberDao.checkId(memberId);
		return result;
	}

	public LoginMemberDTO login(MemberDTO member) {
		MemberDTO m =  memberDao.selectOneMember(member.getMemberId());
		if(m!=null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			String accessToken = jwtUtil.createAccessToken(m.getMemberId(), m.getMemberType());
			String refreshToken = jwtUtil.createRefreshToken(m.getMemberId(), m.getMemberType());
			LoginMemberDTO loginMember = new LoginMemberDTO(accessToken, refreshToken, m.getMemberId(), m.getMemberType());
			return loginMember;
		}
		return null;
	}

	public LoginMemberDTO refresh(String token) {
		try {
			LoginMemberDTO loginMember = jwtUtil.checkToken(token);				
			String accessToken
			= jwtUtil.createAccessToken(loginMember.getMemberId(), loginMember.getMemberType());
			String refreshToken
			= jwtUtil.createRefreshToken(loginMember.getMemberId(), loginMember.getMemberType());
			loginMember.setAccessToken(accessToken);
			loginMember.setRefreshToken(refreshToken);
			return loginMember;
		}catch(Exception e) {
			
		}
		return null;
	}

	public MemberDTO selectOneMember(String token) {
		//로그인시 받은 토큰을 검증한 후 회원 아이디랑 등급을 추출해서 리턴받음
		LoginMemberDTO loginMember = jwtUtil.checkToken(token);
		//토큰해석으로 받은 아이디를 통해서 DB에서 회원정보 조회
		MemberDTO member = memberDao.selectOneMember(loginMember.getMemberId());
		member.setMemberPw(null);
		return member;
	}

	@Transactional
	public int updateMember(MemberDTO member) {
		int result = memberDao.updateMember(member);
		return result;
	}

	public int checkPw(MemberDTO member) {
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
		if(m!=null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
		}
		return 0;
	}

	@Transactional
	public int changePw(MemberDTO member) {
		String encPw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
		int result = memberDao.changePw(member);
		return result;
	}

	@Transactional
	public int deletemember(String token) {
		LoginMemberDTO loginMember = jwtUtil.checkToken(token);
		int result = memberDao.deleteMember(loginMember.getMemberId());
		return result;
	}
}
