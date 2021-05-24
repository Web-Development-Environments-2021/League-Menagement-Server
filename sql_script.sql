CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL
)

CREATE TABLE [dbo].[games](
    [id] [int]  NOT NULL PRIMARY KEY,
	[date] [int] IDENTITY(1,1) NOT NULL,
	[time] [varchar](30) NOT NULL UNIQUE,
	[leag_name] [varchar](300) NOT NULL,
    [home_team_name] [varchar](30) NOT NULL,
    [away_team_name] [varchar](30) NOT NULL,
    [home_score] [int] IDENTITY(1,1) NOT NULL,
    [away_score] [int] IDENTITY(1,1) NOT NULL,
    [filed] [varchar](30) NOT NULL,
    [winner] [varchar](30) NOT NULL,
    [events_scheduleID] [int] FOREIGN KEY REFERENCES events_schedule(events_scheduleID)
);

CREATE TABLE [dbo].[events_schedule](
    [id] [int] NOT NULL PRIMARY KEY,
    [date] [DATE] NOT NULL,
    [time] [TIME] NOT NULL,
    [minute] [int]  NOT NULL,
    [extra_minute] [int] NULL,
    [player_id] [int] NOT NULL,
    [player_name] [varchar] (30) NOT NULL,
    [type] [varchar] (30) NOT NULL
);


CREATE TABLE [dbo].[games](
    [id] [int]  NOT NULL PRIMARY KEY,
	[date] [varchar] (30) NOT NULL,
	[time] [varchar] (30) NOT NULL,
	[league_name] [varchar](300) NOT NULL,
    [home_team_name] [varchar](30) NOT NULL,
    [away_team_name] [varchar](30) NOT NULL,
    [home_score] [int] NOT NULL,
    [away_score] [int] NOT NULL,
    [filed] [varchar] (30) NOT NULL,
    [winner] [varchar] (30) NOT NULL,
);

CREATE TABLE [dbo].[favoriteGames](
    [user_id] [int] IDENTITY(1,1) NOT NULL,
    [games] [varchar] (300) NOT NULL
);