package com.postgresql.centralDB;

import java.io.FileInputStream;
import java.io.IOException;
import java.beans.BeanProperty;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.time.temporal.ValueRange;
import java.util.Collections;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class CentralDbApplication {

	public static void main(String[] args) {

		SpringApplication.run(CentralDbApplication.class, args);

	}

	@Configuration
	public class GoogleConfig {

		@PostConstruct
		public void testCredentialsFile() throws IOException {
			try (InputStream in = new FileInputStream("credentials.json")) {
				if (in.read() == -1) {
					throw new IllegalStateException("credentials.json is empty");
				} else {
					System.out.println("Credentials file is present and readable.");
				}
			}
		}
	}

	@Bean
	public Sheets getSheetsService() throws IOException, GeneralSecurityException {
		GoogleClientSecrets clientSecrets;

		try (InputStream in = new FileInputStream("credentials.json")) {
			clientSecrets = GoogleClientSecrets.load(
					GsonFactory.getDefaultInstance(),
					new InputStreamReader(in));
		}

		GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
				GoogleNetHttpTransport.newTrustedTransport(),
				GsonFactory.getDefaultInstance(),
				clientSecrets,
				Collections.singletonList(SheetsScopes.SPREADSHEETS))
				.setDataStoreFactory(new FileDataStoreFactory(new File("tokens")))
				.setAccessType("offline")
				.build();

		LocalServerReceiver receiver = new LocalServerReceiver.Builder()
				.setPort(8888)
				.setCallbackPath("/Callback")
				.build();

		Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

		return new Sheets.Builder(
				GoogleNetHttpTransport.newTrustedTransport(),
				GsonFactory.getDefaultInstance(),
				credential)
				.setApplicationName("Sheets Java Connection")
				.build();
	}

}
