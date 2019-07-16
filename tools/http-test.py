#!/usr/bin/env python

"""
Start a simple HTTP server in order to test the behavior of the the BALTEK game
when the HTML pages are served by a web site (e.g. a blog)

Based on the receipe adapted from Python2:
    1) Move in the directory to be served.
    2) Execute the following command: python -m SimpleHTTPServer 8000
    3) Open the following uRL in you web browser: http://localhost:8000

Credits:
1) https://docs.python.org/2/library/simplehttpserver.html?highlight=simplehttpserver
    Copyright 1990-2018, Python Software Foundation.
"""

_COPYRIGHT_AND_LICENSE = """
BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END
"""

import datetime
import os
import sys

import http.server
import socketserver


class Unbuffered(object):

   def __init__(self, stream):
       self.stream = stream

   def write(self, data):
       self.stream.write(data)
       self.stream.flush()

   def writelines(self, datas):
       self.stream.writelines(datas)
       self.stream.flush()

   def __getattr__(self, attr):
       return getattr(self.stream, attr)


def start_server(project_home, port):
    os.chdir(project_home)

    Handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", port), Handler)

    print()
    print( "Serving BALTEK at port %d." % port )
    print()
    print( "Open the URL http://localhost:%d in your web browser." % port )
    print()
    print( "For stopping the server:" )
    print( "  1) Quit your web browser." )
    print( "  2) Type one or more time CTRL+C in the terminal you started this script." )
    print()

    httpd.serve_forever()

port = 8080

project_home = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tmp_path = os.path.join(project_home, "tmp")
log_path = os.path.join(tmp_path, os.path.basename(__file__) + ".log.txt")
log_stream = open(log_path, "w")
sys.stdout = Unbuffered(log_stream)
sys.stderr = sys.stdout

print()
print( "Hello " + datetime.datetime.now().isoformat() )

start_server(project_home, port)

print()
print( "Bye " + datetime.datetime.now().isoformat() )

print()
sys.exit(0)
