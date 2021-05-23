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
    [id]NOT NULL PRIMARY KEY,
    [team_id]
    [type]
    [var_result]
    [fixture_id]
    [player_id]
    [player_name]
    [related_player_id]
    [related_player_name]
    [minute]
    [extra_minute]
    [reason]
    [injuried]
    [result]
    [on_pitch]
    [player] FOREIGN KEY REFERENCES
);


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