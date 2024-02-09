package com.coopereats.springboot.data;
import jakarta.persistence.*;

@Entity
@Table(name="USERS")
public class User {

    @Id
    @Column(name="USER_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(name="USER_NAME")
    private String userName;

    @Column(name="PASSWORD")
    private String password;

    @Column(name="TOTAL_GAMES")
    private int totalGames;

    @Column(name="TOTAL_WIN")
    private int totalWin;

    @Column(name="TOTAL_LOSS")
    private int totalLoss;

    @Column(name="TOTAL_TIE")
    private int totalTie;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getTotalGames() {
        return totalGames;
    }

    public void setTotalGames(int totalGames) {
        this.totalGames = totalGames;
    }

    public int getTotalWin() {
        return totalWin;
    }

    public void setTotalWin(int totalWin) {
        this.totalWin = totalWin;
    }

    public int getTotalLoss() {
        return totalLoss;
    }

    public void setTotalLoss(int totalLoss) {
        this.totalLoss = totalLoss;
    }

    public int getTotalTie() {
        return totalTie;
    }

    public void setTotalTie(int totalTie) {
        this.totalTie = totalTie;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", totalGames=" + totalGames +
                ", totalWin=" + totalWin +
                ", totalLoss=" + totalLoss +
                ", totalTie=" + totalTie +
                '}';
    }
}
