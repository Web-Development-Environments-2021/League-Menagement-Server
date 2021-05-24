IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[events_schedule]') AND type in (N'U'))
DROP TABLE [dbo].[events_schedule]
GO

CREATE TABLE [dbo].[events_schedule](
	[events_scheduleID] [bigint] NOT NULL,
	[date] [varchar](30) NOT NULL,
	[time] [varchar](30) NOT NULL,
	[minute] [int] NOT NULL,
	[extra_minute] [int] NULL,
	[player_id] [int] NOT NULL,
	[player_name] [varchar](30) NOT NULL,
	[type] [varchar](30) NOT NULL
);
-- IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[games]') AND type in (N'U'))
-- DROP TABLE [dbo].[games]
-- GO

-- CREATE TABLE [dbo].[games](
--     [id] [bigint]  NOT NULL PRIMARY KEY,
-- 	[date] [varchar] (30) NOT NULL,
-- 	[time] [varchar] (30) NOT NULL,
-- 	[league_name] [varchar](300) NOT NULL,
--     [home_team_name] [varchar](30) NOT NULL,
--     [away_team_name] [varchar](30) NOT NULL,
--     [home_score] [int] NOT NULL,
--     [away_score] [int] NOT NULL,
--     [filed] [varchar] (30) NOT NULL,
--     [winner] [varchar] (30) NOT NULL,
-- );
