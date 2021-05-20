CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL
)

CREATE TABLE [dbo].[games](
	[date] [int] IDENTITY(1,1) NOT NULL,
	[time] [varchar](30) NOT NULL UNIQUE,
	[leag_name] [varchar](300) NOT NULL,
    [home_team_name] [varchar](30) NOT NULL,
    [away_team_name] [varchar](30) NOT NULL,
    [home_score] [int] IDENTITY(1,1) NOT NUL,
    [away_score] [int] IDENTITY(1,1) NOT NUL,
    [filed] [varchar](30) NOT NULL,
    [winner] [varchar](30) NOT NULL,
    [events_schedule]
)