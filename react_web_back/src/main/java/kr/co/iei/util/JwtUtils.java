package kr.co.iei.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@Component
public class JwtUtils {
	@Value("${jwt.secret-key}")
	public String secretKey;
	@Value("${jwt.expire-hour}")
	public int expireHour;
	@Value("${jwt.expire-hour-refresh}")
	public int expireHourRefresh;
	
	//1시간짜리 토큰생성
	public String createAccessToken(String memberId, int memberType) {
		//1. 작성해둔 키값을 이용해서 암호화코드 생성
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		//2. 토큰 생성시간 및 만료시간 설정
		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHour);
		Date expireTime = c.getTime();
		
		String token = Jwts.builder()				//JWT생성 시작
							.issuedAt(startTime)	//토큰발행 시작시간
							.expiration(expireTime) //토큰만료 시간
							.signWith(key) 			//암호화 서명
							.claim("memberId", memberId)
							.claim("memberType", memberType)
							.compact();
		return token;
	}
	
	//8760시간(1년)짜리 accessToken
	public String createRefreshToken(String memberId, int memberType) {
		//1. 작성해둔 키값을 이용해서 암호화코드 생성
				SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
				//2. 토큰 생성시간 및 만료시간 설정
				Calendar c = Calendar.getInstance();
				Date startTime = c.getTime();
				c.add(Calendar.HOUR, expireHourRefresh);
				Date expireTime = c.getTime();
				
				String token = Jwts.builder()				//JWT생성 시작
									.issuedAt(startTime)	//토큰발행 시작시간
									.expiration(expireTime) //토큰만료 시간
									.signWith(key) 			//암호화 서명
									.claim("memberId", memberId)
									.claim("memberType", memberType)
									.compact();
				return token;
	}
}
