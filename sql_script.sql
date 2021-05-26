EXEC sp_rename '[dbo].[favoriteGames].games', 'game_id', 'COLUMN';

CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL
)


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[favoriteGames]') AND type in (N'U'))
DROP TABLE [dbo].[favoriteGames]
GO

CREATE TABLE [dbo].[favoriteGames](
    [user_id] [int] NOT NULL,
    [game_id] [bigint] NOT NULL
);

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
DROP TABLE [dbo].[users]
GO
CREATE TABLE [dbo].[users](
	[user_id] [int] PRIMARY KEY NOT NULL,
	[username] [varchar](30) NOT NULL,
	[password] [varchar](300) NOT NULL,
	[permissions] [varchar](30) NULL,
	[first_name] [varchar](40) NULL,
	[last_name] [varchar](40) NULL,
	[country] [varchar](40) NULL,
	[email] [varchar](40) NULL,
	[image_user] [image] NULL
)

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[events_schedule]') AND type in (N'U'))
DROP TABLE [dbo].[events_schedule]
GO

CREATE TABLE [dbo].[events_schedule](
	[events_scheduleID] [bigint] PRIMARY KEY NOT NULL,
	[date] [smalldatetime] NOT NULL,
	[minute] [int] NOT NULL,
	[extra_minute] [int] NULL,
	[player_id] [int] NOT NULL,
	[player_name] [varchar](40) NOT NULL,
	[type] [varchar](30) NOT NULL
);
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[games]') AND type in (N'U'))
DROP TABLE [dbo].[games]
GO

CREATE TABLE [dbo].[games](
    [id] [bigint]  NOT NULL PRIMARY KEY,
	[date] [smalldatetime] NOT NULL,
	[league_name] [varchar](300) NOT NULL,
    [home_team_name] [varchar](30) NOT NULL,
    [away_team_name] [varchar](30) NOT NULL,
    [home_score] [int] NOT NULL,
    [away_score] [int] NOT NULL,
    [field] [varchar] (30) NOT NULL,
    [winner] [varchar] (30) NULL,
);
