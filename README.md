# AIS-Drone
Game of Drones - HS KL Seminar


## Installation ##


Vor der Installation muss zunächst NodeJS installiert werden. Nutzen Sie hierzu den Download auf der offiziellen Website (https://nodejs.org/en/)


Zur Installation muss das Projektverzeichnis aus dem GitHub Repository (https://github.com/fog1992/AIS-Drone) heruntergeladen werden. Öffnen Sie anschließend ein Terminal und navigieren Sie zu besagtem Projektverzeichnis. Starten Sie die Einrichtung des Programms nun mit folgendem Befehl.

```npm install```


Sofern NodeJS installiert wurde und eine Internetverbindung existiert, werden nun alle benötigten Module automatisch installiert. Kommt bei der OpenCV Installation eine Fehlermeldung  kann die Anwendung dennoch mit Ausnahme des MPEG Streams vollständig genutzt werden.


Sollte die Installation von OpenCV fehlschlagen, kann dies "manuell" nachinstalliert werden. 
Hierfür bieten sich die automatischen Installationsscripts des GitHub Benutzers jayrambhia an, welche für verschiedene Linuxdistributionen und OpenCV Versionen existieren (https://github.com/jayrambhia/Install-OpenCV). 

WICHTIG: Installieren Sie eine OpenCV Version mit einer Versionsnummer <=  2.4.10, da die Installation des benötigten Moduls sonst fehlschlägt.

## Starten der Anwendung ##
Die Anwendung kann mit ```npm start``` oder durch Aufrufen von ```node main.js [OPTION]``` gestartet werden.
Per Default wird die Tastatur zum Steuern benutzt und auf der Konsole werden dem Benutzer die wichtigsten Informationen angezeigt. Mit den Tasten '1', '2' und '3' können weitere Geräte zum Steuern aktiviert werden. Das Hilfemenü wird mit der Option --help oder -? angezeigt:

| Option       |Oprion2          | Beschreibung  |
| ------------- |:-------------:| -----:|
|- ?      | -- help | Übersicht über alle Parameter |
| - r <radius>      | --geofencingradius     |   Setzt Geofencing Radius (in Meter) |
| - l <level> | --log <level>      |    Setzt Log Level (10-60) |
|- v|--verbose|Direkte Debug Ausgaben und Unterdrückung des UI |
||--no-ui|Unterdrückt das UI|
|-s|--stream|Startet MPEG Stream (nur Unix mit OpenCV)|
||--race-mode|Startet Applikation mit aktiviertem Race Mode|

Wichtig: Soll das Wii Balance Board genutzt werden, so muss in einem kurzen Zeitraum nach dem Start der Applikation der Synchronisationsbutton am Balance Board gedrückt werden. Dieser befindet sich innerhalb des Batteriefachs an der unteren Seite des Balance Boards. Beim Versuch der Verbindung blinkt die LED des Buttons am Rand des Boards blau. Die Verbindung ist dann hergestellt, wenn der Button dauerhaft blau leuchtet. Schlägt die Verbindung fehl und soll das Balance Board dennoch genutzt werden, muss die Hauptanwendung zunächst gestoppt werden und der Verbindungsversuch beim erneuten Start ein zweites Mal versucht werden. 

Das Balance Board muss vor der Nutzung zunächst kalibriert werden. Dieser Vorgang wird automatisch bei der ersten Aktivierung (Taste „3“ auf der Tastatur) des Boards aktiviert. Hierbei muss ein Nutzer auf dem Board sich in die Richtung lehnen, die von der  Hauptapplikation vorgegeben wird.


## Bedienung ##

Das Programm ist als Konsolenapplikation konzipiert. Diese stellt die zentrale Verwaltungseinheit dar. Der Benutzer hat ständig im Blick, welche Peripheriegeräte angeschlossen und gerade aktiviert sind. Zudem erhält er Informationen über den Status der Drohne wie z.B. den Akkustand und den aktuellen Flugstatus.
Die Drohne kann vollständig über die Tastatur gesteuert werden. Dies hat hauptsächlich sicherheitstechnische Gründe und ist dazu gedacht, um z.B. bei Kontrollverlust eines der Peripheriegeräte über die Drohne jederzeit eingreifen zu können.
Hier kann zudem der Racing Modus aktiviert werden. Hierbei können für alle drei angebundenen Peripheriegeräte Zeitmessungen zur Absolvierung eines zuvor festgelegten Parcours durchgeführt werden.

![screenshot 6](https://cloud.githubusercontent.com/assets/9308836/16701880/05446354-4563-11e6-9bd9-471311c08627.jpg)

## Tastenbelegung

### Keyboard ###

![keyboard](https://cloud.githubusercontent.com/assets/9308836/16702207/d539f852-4564-11e6-9840-fc26d317c9dd.png)

### Xbox ###

![screenshot 8](https://cloud.githubusercontent.com/assets/9308836/16701679/97f86422-4561-11e6-915c-c6c26470ed24.jpg)

### ATK3 ###

![screenshot 9](https://cloud.githubusercontent.com/assets/9308836/16701681/9f51270e-4561-11e6-8e9f-c1b1ffe25bec.jpg)



###License###


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
