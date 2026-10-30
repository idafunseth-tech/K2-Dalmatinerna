USE [EventDB]
GO
/****** Object:  StoredProcedure [dbo].[usp_CreateBooking]    Script Date: 2026-10-30 16:21:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_CreateBooking]
    @PersonID INT,
    @ActivityID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kriterium: Hantera ogiltiga/matchningslösa indata utan att krascha (returnera tom tabell)
    IF NOT EXISTS (SELECT 1 FROM dbo.Person WHERE PersonID = @PersonID) 
       OR NOT EXISTS (SELECT 1 FROM dbo.Activity WHERE ActivityID = @ActivityId)
    BEGIN
        -- Returnerar en tom resultatuppsättning med samma kolumner som din vy
        SELECT 
            CAST(NULL AS INT) AS ActivityID,
            CAST(NULL AS VARCHAR(100)) AS ActivityName,
            CAST(NULL AS INT) AS TotalQuantity
        WHERE 1 = 0; 
        RETURN;
    END

    -- 2. Lägg till den nya bokningen i tabellen
    INSERT INTO dbo.Booking (PersonID, ActivityID, BookedAt)
    VALUES (@PersonID, @ActivityID, GETDATE());

    -- 3. Kriterium: Returnera ett rent och läsbart resultat via din vy
    -- Vi hämtar den aktuella aktivitetens nya status/antal från din befintliga vy
    SELECT 
        ActivityID,
        ActivityName,
        TotalQuantity
    FROM dbo.vw_BookedSlotsByActivity
    WHERE ActivityID = @ActivityID;
END
